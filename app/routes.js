if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

const React = require('react');
const AsyncRoute = require('./helpers/async-route');

let Home, About, Contact, Me;

if (process.env.BROWSER) {
  // This strange way to declare the route's components is required
  // because you need to resolve the dependency in a synchronous way to match
  // the app rendered in the server with the app rendered in the client.
  // You return a component instead of a promise if the chunk is already loaded
  Home = () => __webpack_modules__[require.resolveWeak('./Home')] ? __webpack_require__(require.resolveWeak('./Home')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./Home')), null, 'home'));
  About = () => __webpack_modules__[require.resolveWeak('./About')] ? __webpack_require__(require.resolveWeak('./About')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./About')), null, 'about'));
  Contact = () => __webpack_modules__[require.resolveWeak('./Contact')] ? __webpack_require__(require.resolveWeak('./Contact')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./Contact')), null, 'contact'));
  Me = () => __webpack_modules__[require.resolveWeak('./Me')] ? __webpack_require__(require.resolveWeak('./Me')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./Me')), null, 'me'));
} else {
  Home = () => require('./Home');
  About = () => require('./About');
  Contact = () => require('./Contact');
  Me = () => require('./Me');
}


const routes = [
  {
    path: '/',
    chunkName: 'home',
    exact: true,
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Home()} {...props} />,
    loadData: () => console.log('aalalala'),
  },
  {
    path: '/about',
    chunkName: 'about',
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={About()} {...props} />,
    loadData: () => new Promise(resolve => setTimeout(resolve, 4000))
  },
  {
    path: '/contact',
    chunkName: 'contact',
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Contact()} {...props} />,
    routes: [
      {
        path: '/contact/me',
        chunkName: 'me',
        render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Me()} {...props} />,
        loadData: () => console.log('me')
      }
    ]
  },
];

module.exports = routes;
