import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

var TSCreators = require('./TSCreators/TSCreators.jsx');
var TSCreatorsDashboard = require('./TSCreators/TSCreatorsDashboard.jsx');
var TSData = require('../TSData.js');

function requireAuth(nextState, replace) {
  if (!TSData.currentUser) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

var login = document.getElementById('tiny_show_connect');
if (login) {
  ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={TSCreators}>
      </Route>
      <Route
        path="/dash"
        component={TSCreatorsDashboard}
        onEnter={requireAuth}>
      </Route>
    </Router>,
  login);
}
