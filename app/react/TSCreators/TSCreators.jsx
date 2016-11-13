import React, {Component} from 'react';

var TSFacebookLogin = require('./TSFacebookLogin.jsx');
var TSMissingPermissions = require('./TSMissingPermissions.jsx');
var TSTopNavBar = require('../components/TSTopNavBar.jsx');
var TSBoostBranding = require('./TSBoostBranding.jsx');
var TSCreatorsDashboard = require('./TSCreatorsDashboard.jsx');
var TSFacebookHelpers = require('../../TSFacebookHelpers.js');
var TSStyle = require('../../TSStyle.js');

class TSBoostMarketing extends React.Component {
  render() {
    return (
      <div style={{fontSize: 16, marginTop: 8}}>
        <span style={{color: TSStyle.pink}}>Boost</span> increases your <span style={{color: TSStyle.lightBlue}}>Facebook</span> event RSVP's by making it <u>super easy</u> for users to respond. Get setup in less than 60 seconds.
      </div>
    )
  }
}

class TSCreators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curFacebookUser: null,
      curTinyShowUser: null,
      missingPermissions: null,
    };
    this.checkPermissions = this.checkPermissions.bind(this);
    this.grant = this.grant.bind(this);
    this.facebookConnected = this.facebookConnected.bind(this);
    this.onSettingsSaved = this.onSettingsSaved.bind(this);
  }
  checkPermissions() {
    TSFacebookHelpers.getGrantedPermissions(granted => {
      this.setState({
        missingPermissions: REQUIRED_CREATOR_PERMISSIONS.filter((p) => {
          return granted.indexOf(p) < 0;
        })
      });
    });
  }
  grant() {
    FB.login(response => {
      console.log("SHOULD NOT BE SETTING missingPermissions empty here,\
        this just means login button was hit but they could have rejected the grant");
      this.setState({missingPermissions: []});
    },
    {
      scope: this.state.missingPermissions.join(','),
      auth_type: 'rerequest'
    });
  }
  facebookConnected() {
    this.checkPermissions();
    TinyShowApi.getExistingUser((u) => {
      if (u['id']) {
        this.setState({curTinyShowUser: new TinyShowUser(u)});
      } else {
        TSFacebookHelpers.getCurrentUserProfile((facebookUser) => {
          this.setState({curFacebookUser: facebookUser});
        });
      }
    });
  }
  hayMissingPermissions() {
    return this.state.missingPermissions != null &&
      this.state.missingPermissions.length > 0;
  }
  onSettingsSaved(u) {
    this.setState({curTinyShowUser: new TinyShowUser(u)});
  }
  renderRegisteredUser() {
    return (
      <TSCreatorsDashboard currentUser={this.state.curTinyShowUser} />
    )
  }
  renderFacebookAuthenticatedUser() {
    if (this.hayMissingPermissions()) {
      return
        <TSMissingPermissions
          missingPermissions={this.state.missingPermissions}
          onGrant={this.grant}
        />;
    } else {
      return
        <TSUserRegistration
          curFacebookUser={this.state.curFacebookUser}
          onSettingsSaved={this.onSettingsSaved}
        />;
    }
  }
  renderUnauthenticated() {
    return (
      <TSFacebookLogin facebookConnected={this.facebookConnected} />
    )
  }
  render() {
    var body;
    if (this.state.curTinyShowUser) {
      body = this.renderRegisteredUser();
    } else if (this.state.curFacebookUser) {
      body = this.renderFacebookAuthenticatedUser();
    } else {
      body = this.renderUnauthenticated();
    }

    return (
      <div>
        <TSTopNavBar>
          <TSBoostBranding />
        </TSTopNavBar>
        <div
          style={{
            paddingTop: 60,
            paddingRight: 60,
            width: 800,
          }}>
          {!this.state.curTinyShowUser &&
            <TSBoostMarketing />
          }
          {body}
        </div>
      </div>
    )
  }
}

module.exports = TSCreators;
