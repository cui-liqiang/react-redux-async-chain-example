const InnerUser = function (props) {
  return (
    <div className='userContainer'>
      <h3>用户信息</h3>
      <div>
        userId: {props.user.id}
      </div>
      <div>
        username: {props.user.name}
      </div>
    </div>
  );
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    user: state.user
  }
}

const User = ReactRedux.connect(
  mapStateToProps,
  dispatch => Redux.bindActionCreators({
    fetchUserAction: fetchUserAction
  }, dispatch)
)(InnerUser)