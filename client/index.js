const React = require('react');
const ReactDOM = require('react-dom');
const { AppContainer } = require('react-hot-loader');
const { BrowserRouter } = require('react-router-dom');
const { Provider } = require('react-redux');
const Store = require('../app/store');
const App = require('../app');

ReactDOM.render(
  <AppContainer>
    <Provider store={Store} >
      <BrowserRouter>
        <App/>
      </BrowserRouter>
      </Provider>
  </AppContainer>,
  document.getElementById('root')
);

//Test SW
navigator.serviceWorker.register('/sw.js').then(() => {
  console.log('service worker ok!')
});

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('../app', () => {
    const NextApp = require('../app');
    ReactDOM.render(
      <AppContainer>
        <BrowserRouter>
          <NextApp/>
        </BrowserRouter>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}