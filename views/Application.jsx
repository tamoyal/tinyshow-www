var React    = require('react');
var ReactDOM = require('react-dom');

var LoginBox = require('./LoginBox.jsx');

// Poor man's routing or good idea?
var login = document.getElementById('loginPage');
if (login) {
  ReactDOM.render(<LoginBox />, login);
}
