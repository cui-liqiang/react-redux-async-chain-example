const Provider = ReactRedux.Provider;

const domContainer = document.querySelector('#root');
ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>
, domContainer);