const React = require('react');
const { Switch, Route, Link } = require('react-router-dom');
const Home = require('./Home');
const About = require('./About');
const Contact = require('./Contact');

const App = () => (
  <main>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
    </Switch>
  </main>
);

module.exports = App;