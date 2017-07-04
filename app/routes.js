if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

const Home = require('./Home');
const About = require('./About');
const Contact = require('./Contact');

const routes = [
  { path: '/',
    component: Home,
    loadData: () => console.log('aalalala'),
  },
  { path: '/about',
    component: About,
    loadData: () => console.log('aalalala'),
  },
  { path: '/contact',
    component: Contact,
    loadData: () => console.log('aalalala'),
  },
];

module.exports = routes;
