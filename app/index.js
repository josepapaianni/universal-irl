const React = require('react');
const { Switch, Route, Link } = require('react-router-dom');
const routes = require('./routes');

const App = () => (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <Switch>
        {routes.map(route => <Route key={route.path} path={route.path} exact={route.exact} render={route.render.bind(null, route.routes)} />)}
      </Switch>
    </div>
  );

module.exports = App;