const React = require('react');
const { Link, Route } = require('react-router-dom');

class Contact extends React.Component {
  render() {
    return (
      <div>
        <h3>Contact</h3>
        <ul>
          <li><Link to="/contact/me">I'm Contact!</Link></li>
        </ul>
        {this.props.routes.map(route => <Route key={route.path} {...route}/>)}
      </div>

    )
  }
}

module.exports = Contact;