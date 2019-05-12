function reducers(state = [], action) {
  switch (action.type) {
    case 'SET_POSTS':
      return {...state, posts: action.data};
    case 'SET_USER':
      return {...state, user: action.data};
    default:
      return state
  }
}

const initState = {
  posts: [],
  user: {}
}

const store = Redux.createStore(reducers, initState, Redux.applyMiddleware(ReduxThunk.default));
