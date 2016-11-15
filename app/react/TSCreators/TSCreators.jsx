import React, {Component} from 'react';

var TSFacebookLogin = require('./TSFacebookLogin.jsx');
var TSMissingPermissions = require('./TSMissingPermissions.jsx');
var TSTopNavBar = require('../components/TSTopNavBar.jsx');
var TSBoostBranding = require('./TSBoostBranding.jsx');
var TSFacebookHelpers = require('../../TSFacebookHelpers.js');
var TSUserRegistration = require('./TSUserRegistration.jsx');
var TSBoostMarketing = require('./TSBoostMarketing.jsx');
var TSData = require('../../TSData.js');

class TSCreators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      missingPermissions: null,
    };
    this.checkPermissions = this.checkPermissions.bind(this);
    this.grant = this.grant.bind(this);
    this.login = this.login.bind(this);
    this.facebookConnected = this.facebookConnected.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
    this.onUserUpdated = this.onUserUpdated.bind(this);
  }
  checkPermissions() {
    TSFacebookHelpers.getGrantedPermissions(granted => {
      var missingPermissions = REQUIRED_CREATOR_PERMISSIONS.filter((p) => {
        return granted.indexOf(p) < 0;
      });

      if (missingPermissions.length == 0 && TSData.currentUser.confirmedAt) {
        this.props.router.replace('dash');
      } else {
        this.setState({
          missingPermissions: missingPermissions,
          currentUser: TSData.currentUser,
        });
      }
    });
  }
  grant() {
    FB.login(response => {
      this.checkPermissions();
    },
    {
      scope: this.state.missingPermissions.join(','),
      auth_type: 'rerequest'
    });
  }
  facebookConnected() {
    this.login();
  }
  login() {
    TinyShowApi.login(
      (user) => {
        TSData.currentUser = new TinyShowUser(user);
        this.checkPermissions();
      },
      (error) => {
        console.log(error);
      });
  }
  hayMissingPermissions() {
    return this.state.missingPermissions != null &&
      this.state.missingPermissions.length > 0;
  }
  onRegistered() {
    this.props.router.replace('dash');
  }
  onUserUpdated(user) {
    TSData.currentUser = user;
    this.setState({currentUser: user});
  }
  renderFacebookAuthenticatedUser() {
    if (this.hayMissingPermissions()) {
      return  (
        <TSMissingPermissions
          missingPermissions={this.state.missingPermissions}
          onGrant={this.grant}
        />
      )
    } else {
      return  (
        <TSUserRegistration
          currentUser={this.state.currentUser}
          onRegistered={this.onRegistered}
        />
      )
    }
  }
  renderUnauthenticated() {
    return (
      <TSFacebookLogin facebookConnected={this.facebookConnected} />
    )
  }
  render() {
    return (
      <div>
        <TSTopNavBar>
          <TSBoostBranding />
        </TSTopNavBar>
        <TSBoostMarketing
          style={{
            paddingLeft: 60,
            paddingRight: 40,
            marginTop: 16,
            width: 800,
          }}
        />
        <div
          style={{
            padding: '40px 40px 40px 0px',
            width: 800,
          }}>
          {this.state.currentUser ? 
            this.renderFacebookAuthenticatedUser() :
            this.renderUnauthenticated()}
        </div>
      </div>
    )
  }
}

module.exports = TSCreators;
