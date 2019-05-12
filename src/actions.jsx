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

function fetchUserAction(name) {
  return dispatch => {
    return fetchUser({
      name
    }, (result) => {
      return dispatch(setUser(result));
    })
  }
}

function fetchPostsByUserAction(userId) {
  return dispatch => {
    fetchPostsByUser({
      userId
    }, result => {
      return dispatch(setPosts(result));
    })
  }
}