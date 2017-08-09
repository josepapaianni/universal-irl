if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

const React = require('react');
const AsyncRoute = require('./components/async-route');

let Home, About, Contact, Me;

if (process.env.BROWSER) {
  // This strange way to declare the route's components is required
  // because you need to resolve the dependency in a synchronous way to match
  // the app rendered in the server with the app rendered in the client.
  // You return a component instead of a promise if the chunk is already loaded
  Home = () => __webpack_modules__[require.resolveWeak('./home')] ? __webpack_require__(require.resolveWeak('./home')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./home')), null, 'home'));
  About = () => __webpack_modules__[require.resolveWeak('./about')] ? __webpack_require__(require.resolveWeak('./about')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./about')), null, 'about'));
  Contact = () => __webpack_modules__[require.resolveWeak('./contact')] ? __webpack_require__(require.resolveWeak('./contact')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./contact')), null, 'contact'));
  Me = () => __webpack_modules__[require.resolveWeak('./about/me')] ? __webpack_require__(require.resolveWeak('./about/me')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./about/me')), null, 'me'));
} else {
  Home = () => require('./home');
  About = () => require('./about');
  Contact = () => require('./contact');
  Me = () => require('./about/me');
}


const routes = [
  {
    path: '/',
    chunkName: 'home',
    exact: true,
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Home()} {...props} />,
    loadData: () => new Promise(resolve => setTimeout(resolve, 500)),
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
        loadData: () => new Promise(resolve => setTimeout(resolve, 200))
      }
    ]
  },
];

module.exports = routes;
