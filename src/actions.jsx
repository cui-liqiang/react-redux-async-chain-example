function setUser(result) {
  return {
    type: 'SET_USER',
    data: result
  }
}

function setPosts(result) {
  return {
    type: 'SET_POSTS',
    data: result
  }
}

function toPromise1(f) {
  return (option) => {
    return new Promise((resolve, reject) => {
      f(option, resolve)
    })
  }
}

function fetchUserAction(name) {
  return dispatch => {
    return toPromise1(fetchUser)({
      name
    }).then((result) => {
      return dispatch(setUser(result));
    })
  }
}

function fetchPostsByUserAction(userId) {
  return dispatch => {
    toPromise1(fetchPostsByUser)({
      userId
    }).then(result => {
      return dispatch(setPosts(result));
    })
  }
}