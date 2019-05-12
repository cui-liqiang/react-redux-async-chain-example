class ContainerInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'liqiang',
      userID: 1
    };
  }

  fetchUserAndPost() {
    const that = this;
    co(function* () {
      yield that.props.fetchUserAction(that.state.name)
      that.props.fetchPostsByUserAction(that.props.user.id)
    })
  }

  render() {
    return <div>
      <div className='dataContainerWrapper container'>
        <h2>参考数据</h2>
        <div className='dataContainer'>
          <pre>
            //所有用户
            <br />
            {JSON.stringify(persons, null, 2)}
            <br/>
            <br />
            //所有post及其用户归属
            <br />
            {JSON.stringify(posts, null, 2)}
          </pre>
        </div>
    </div>
    <div className='displayContainer container'>
      <h2>结果显示</h2>
      <User />
      <Posts />
    </div>
    <div className='manipulationContainer container'>
      <h2>操作区</h2>
      <div className='formItem'>
        <span>用户名: </span> <input id="username" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
      </div>
      <div className='formItem'>
        <span>用户ID: </span> <input id="userId" value={this.state.userID} onChange={e => this.setState({userID: e.target.value})} />
      </div>
      <div className='formItem'>
        <input type='button' onClick={e => this.props.fetchUserAction(this.state.name)} value="按名字加载用户" />
      </div>
      <div className='formItem'>
        <input type='button' onClick={e => this.props.fetchPostsByUserAction(this.state.userID)} value="按用户ID加载Post" />
      </div>
      <div className='formItem'>
        <input type='button' onClick={this.fetchUserAndPost.bind(this)} value="按用户名加载用户信息及Post" />
      </div>
    </div>
  </div>
  }
}

const Container = ReactRedux.connect(
  state => state,
  dispatch => Redux.bindActionCreators({
    fetchUserAction: fetchUserAction,
    fetchPostsByUserAction: fetchPostsByUserAction
  }, dispatch)
)(ContainerInner)