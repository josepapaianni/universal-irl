const { createStore, compose, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const reducers = require('./reducers');

const isBrowser = typeof window !== 'undefined';

const preloadedState = isBrowser && window.__PRELOADED_STATE__ ? window.__PRELOADED_STATE__ : {};

isBrowser && window.__PRELOADED_STATE__ ? delete window.__PRELOADED_STATE__ : null;

const composeEnhancers = isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const Store = createStore(reducers, preloadedState,
  composeEnhancers(applyMiddleware(thunk)));

module.exports = Store;