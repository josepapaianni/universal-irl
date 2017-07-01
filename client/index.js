const React = require('react');
const ReactDOM = require('react-dom');
const { AppContainer } = require('react-hot-loader');
const { BrowserRouter } = require('react-router-dom');
const App = require('../app');


ReactDOM.render(
  <AppContainer>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </AppContainer>,
  document.getElementById('root')
);

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