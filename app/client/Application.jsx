import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

var TSCreators = require('./TSCreators/TSCreators.jsx');
var TSConsumers = require('./TSConsumers/TSConsumers.jsx');
var TSCreatorsDashboard = require('./TSCreators/TSCreatorsDashboard.jsx');
var TSData = require('./TSData.js');

function requireAuth(nextState, replace) {
  if (!TSData.currentUser) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

var login = document.getElementById('tiny_show_connect');
var show = document.getElementById('tiny_show');

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
} else if (show) {
  ReactDOM.render(
    <Router history={hashHistory}>
      <Route
        path="/"
        component={
          () => (<TSConsumers event={event} og={og} settings={settings} />)
        }>
      </Route>
    </Router>,
  show);
}
