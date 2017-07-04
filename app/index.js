const React = require('react');
const { Switch, Route, Link } = require('react-router-dom');
const routes = require('./routes');

const App = () => (
  <main>
    <nav>
      <ul>
        <li><Link to="/">Homeasdasd</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
    <Switch>
      {routes.map(route => <Route key={route.path} {...route}/>)}
    </Switch>
  </main>
);

module.exports = App;