import React, {Component} from 'react';

var TSFacebookLogin = require('./TSFacebookLogin.jsx');
var TSMissingPermissions = require('./TSMissingPermissions.jsx');
var TSTopNavBar = require('../components/TSTopNavBar.jsx');
var TSBoostBranding = require('./TSBoostBranding.jsx');
var TSCreatorsDashboard = require('./TSCreatorsDashboard.jsx');
var TSFacebookHelpers = require('../../TSFacebookHelpers.js');
var TSHelpers = require('../../TSHelpers.js');
var TSUserRegistration = require('./TSUserRegistration.jsx');
var TSStyle = require('../../TSStyle.js');
var TSData = require('../../TSData.js');

class TSBoostMarketing extends React.Component {
  render() {
    return (
      <div
        style={TSHelpers.mergeObj({
          fontSize: 16,
        }, this.props.style)}>
        <span
          style={{
            color: TSStyle.pink,
            fontSize: 26,
            textTransform: 'uppercase',
          }}>
          Boost
        </span> increases your <span style={{color: TSStyle.lightBlue}}>facebook</span> event RSVP's:
        <ul style={{marginBottom: 0}}>
          <li>We encourage "interested" responses to boost your event in facebook news feeds.</li>
          <li>We provide a seamless one tap responses in the TinyShow app.</li>
        </ul>
      </div>
    )
  }
}

class TSCreators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      missingPermissions: null,
    };
    this.checkPermissions = this.checkPermissions.bind(this);
    this.grant = this.grant.bind(this);
    this.facebookConnected = this.facebookConnected.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
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
    if (TSData.currentUser) {
      this.setState({currentUser: TSData.currentUser});
    } else {
      TinyShowApi.login(
        (user) => {
          TSData.currentUser = new TinyShowUser(user);
          this.setState({currentUser: TSData.currentUser});
        },
        (error) => {
          console.log(error);
        });
    }
  }
  hayMissingPermissions() {
    return this.state.missingPermissions != null &&
      this.state.missingPermissions.length > 0;
  }
  onRegistered() {
    this.setState({currentUser: TSData.currentUser});
  }
  renderRegisteredUser() {
    return (
      <TSCreatorsDashboard currentUser={this.state.currentUser} />
    )
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
    var body;
    if (this.state.currentUser) {
      if (this.state.currentUser.confirmedAt) {
        body = this.renderRegisteredUser();
      } else {
        body = this.renderFacebookAuthenticatedUser();
      }
    } else {
      body = this.renderUnauthenticated();
    }

    return (
      <div>
        <TSTopNavBar>
          <TSBoostBranding />
        </TSTopNavBar>
        {(!this.state.currentUser || !this.state.currentUser.confirmedAt) &&
          <TSBoostMarketing
            style={{
              paddingLeft: 60,
              paddingRight: 40,
              marginTop: 16,
              width: 800,
            }}
          />
        }
        <div
          style={{
            padding: '40px 40px 40px 0px',
            width: 800,
          }}>
          {body}
        </div>
      </div>
    )
  }
}

module.exports = TSCreators;
