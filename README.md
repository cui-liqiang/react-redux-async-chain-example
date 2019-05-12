本代码库示例如何在react+redux的技术栈中优雅的进行异步（尤其是级联的异步）数据处理。

这是一个纯面向浏览器的工程，不需要使用node进行代码预处理。但因为使用了类型为'text/babel'的script标签，所以需要将index.html在一个web server中打开。可以使用nginx进行静态host，或者简单的使用python的SimpleHTTPServer模块来做。在代码根目录执行`python -m SimpleHTTPServer`即可。

## 基础代码

下载代码，切换到base分支。并在根目录中启动web server之后。访问http://localhost:8000/index.html ，便可看到下面的图片：
![](https://img.alicdn.com/tfs/TB1soqqVAvoK1RjSZFDXXXY3pXa-2782-1178.png)

其中左边是模拟的后台数据。后边是可以进行的操作。在这个分支上可以看到两个操作：
1. 按照名字加载用户
2. 按照用户ID加载Post


这两个接口背后是通过setTimeout模拟出来的（fakeRemote.jsx）

```
fetchUser(name)

fetchPostsByUser(userId)
```

模拟的异步接口是回调风格的，并使用redux-chunk中间件来处理异步action。见action.jsx：
```
function fetchUserAction(name) {
  return dispatch => {
    return fetchUser({
      name
    }, (result) => {
      return dispatch(setUser(result));
    })
  }
}
```

## 要处理的问题
现在已经有了两个操作，我们要实现第三个操作：”按用户名加载用户信息及Post“。也就是上面两个操作的组合。但由于这两个操作都是异步的，因此最简单的组合方式就是新写一个action，叫做“fetchUserAndRelatedPost”，使用回调套回调的方式实现。这种方式有两个问题：
1. 回调套回调太恶心
2. 多个action之间也出现了重复

因此期望的方式是能够在react组件中复用已有的这两个action，进行优雅的组合。本代码库使用了两种方式进行了实现。

### 使用async/await
切换到async分支看最终代码。

async/await是一种化异步为同步的编码方式，具体原理不在这里展开。简单讲一下代码。

首先，能够await的东西需要是一个promise。什么是promise呢，就是能够响应then和catch这两函数的一个对象。所以需要把之前异步action中的回调风格改成promise风格。

```
//这里加了1的后缀，是因为没有使用后端预处理，所有函数都在顶层作用域，和后面要将的co中的一个方法重名了，所以要区分下。
function toPromise1(f) {
  return (option) => {
    return new Promise((resolve, reject) => {
      f(option, resolve)
    })
  }
}
```
然后把前面的回调风格的action改成promise风格：

```
function fetchUserAction(name) {
  return dispatch => {
    return toPromise1(fetchUser)({
      name
    }).then((result) => {
      return dispatch(setUser(result));
    })
  }
}
```

这里需要强调的一点，这些Action结尾的函数，其实并不是Action，而是“ActionCreator”，调用它返回的那个值才是action，因为太长了，所以都懒得写全。经过react-redux的connect之后，在react组件中调用`this.props.fetchUserAction(userName)`，就相当于调用`store.dispatch(fetchUserAction(userName))`。由于这个action是个函数，且我们使用了redux-thunk这个中间件，所以这个调用最终的返回值其实是下面这一坨东西。

```
return toPromise1(fetchUser)({
  name
}).then((result) => {
  return dispatch(setUser(result));
})
```

也就是一个promise，上面提到了只有promise才能被await，所以才能在react组件中使用这样的代码：`await this.props.fetchUserAction(this.state.name)`。

然后还需要把action中返回的函数使用async进行修饰，这样才能在react组件中使用await进行等待：

```
// action定义
function fetchUserAction(name) {
  return async dispatch => {
    return toPromise1(fetchUser)({
      name
    }).then((result) => {
      return dispatch(setUser(result));
    })
  }
}

// 组件中dispatch的调用（container.jsx）
// 由于await只能在async标记的函数中使用，所以这里也加上了async修饰
async fetchUserAndPost() {
  await this.props.fetchUserAction(this.state.name)
  await this.props.fetchPostsByUserAction(this.props.user.id)
}
```

这样就可以在不增加新的action的前提下，在组件中通过组合来完成自己特性的业务诉求。


### 使用co+generator
切换到co分支看代码。

co+generator也是化异步为同步的神器。效果上基本和async/await类似，写法略有不同。

相同之处是，都需要action（不是action creator哦）返回的结果是一个promise。不同之处是，返回promise的那个函数不需要使用async修饰。

await只能在async的函数中使用，本方案中与await对应的是yield，它只能在generator中使用。并且需要使用co这个函数来驱动generator的执行。因此写出来是这样的：

```
// action定义，不需要async修饰
function fetchUserAction(name) {
  return dispatch => {
    return toPromise1(fetchUser)({
      name
    }).then((result) => {
      return dispatch(setUser(result));
    })
  }
}

// 使用co驱动一个generator，在generator内部使用yield表示等待（container.jsx）
fetchUserAndPost() {
  const that = this;
  co(function* () {
    yield that.props.fetchUserAction(that.state.name)
    that.props.fetchPostsByUserAction(that.props.user.id)
  })
}
```

可以看出，async方案和co+generator都能达到不错的效果。且原理非常的相似，简单的对比下：
1. 串行化代码的上下文，async/await使用关键字驱动；co+generator还需要使用co这个函数包一层来驱动，这点上比async/await差一点。
2. 等待方式，一个用await，一个用yield，都是在等待一个promise的完成。
3. 都需要作用于promise。


## 其他方案
上面的两个方案其实已经足够优雅了，但如果你对无状态有非常高的追求，还可以尝试使用redux-saga来进一步隔离无副作用和有副作用的代码。它也是使用generator来实现的，可以理解为它把上述方案中的co部分的工作做掉了，并且让react组件中的代码“看起来”完全无副作用。相信理解上上述的做法，理解redux-saga就很容易了。
