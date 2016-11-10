var React    = require('react');
var ReactDOM = require('react-dom');

var TSCreators = require('./TSCreators/TSCreators.jsx');

// Poor man's routing or good idea?
var login = document.getElementById('tiny_show_connect');
if (login) {
  ReactDOM.render(<TSCreators />, login);
}
