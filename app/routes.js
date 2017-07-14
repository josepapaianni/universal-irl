if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

const React = require('react');
const AsyncRoute = require('./helpers/async-route');

let Home, About, Contact, Me;
const isBrowser = typeof window !== 'undefined';

if (process.env.BROWSER) {

  // Home = () => new Promise(resolve => require.ensure([], require => resolve(require('./Home')), null, 'home'));
  // About = () => new Promise(resolve => require.ensure([], require => resolve(require('./About')), null, 'about'));
  Contact = () => __webpack_modules__[require.resolveWeak('./Contact')] ? __webpack_require__(require.resolveWeak('./Contact')) :
    new Promise(resolve => require.ensure([], require => resolve(require('./Contact')), null, 'contact'))
  // Me = () => new Promise(resolve => require.ensure([], require => resolve(require('./Me')), null, 'me'));

} else {
  Home = () => require('./Home');
  About = () => require('./About');
  Contact = () => require('./Contact');
  Me = () => require('./Me');
}


const routes = [
  { path: '/',
    exact: true,
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Home()} {...props} />,
    loadData: () => console.log('aalalala'),
  },
  { path: '/about',
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={About()} {...props} />,
    loadData: () => console.log('aalalala'),
  },
  { path: '/contact',
    render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Contact()} {...props} />,
    loadData: () => console.log('aalalala'),
    routes: [
      {
        path: '/contact/me',
        render: (subroutes, props) => <AsyncRoute routes={subroutes} component={Me()} {...props} />,
        loadData: () => console.log('me')
      }
    ]
  },
];

module.exports = routes;
