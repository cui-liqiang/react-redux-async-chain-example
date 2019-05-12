const InnerPosts = function (props) {
  return (
    <div className='postsContainer'>
      <h3>文章</h3>
      {
        props.posts.map(post =>
          <div className="postContainer">
            <div className='formItem'>
              <span>标题: </span> {post.title}
            </div>
            <div className='formItem'>
              <span>内容: </span>
              <div> {post.content}</div>
            </div>
          </div>
        )
      }
    </div>
  )
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    posts: state.posts
  }
}

const Posts = ReactRedux.connect(
  mapStateToProps, {}
)(InnerPosts)