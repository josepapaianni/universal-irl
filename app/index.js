const React = require('react');
const { Switch, Route, Link } = require('react-router-dom');
const routes = require('./routes');
const styles = require('./styles.css');

const App = () => (
    <div>
      <header className={styles.header}>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>
      <Switch>
        {routes.map(route => <Route key={route.path} path={route.path} exact={route.exact} render={route.render.bind(null, route.routes)} />)}
      </Switch>
    </div>
  );

module.exports = App;