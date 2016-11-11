import React, {Component} from 'react';

var TSLoginBox = require('./TSLoginBox.jsx');
var TSMissingPermissions = require('./TSMissingPermissions.jsx');
var TSUserSettings = require('./TSUserSettings.jsx');
var TSUserSettingsEdit = require('./TSUserSettingsEdit.jsx');
var TSNavigation = require('./TSNavigation.jsx');

class TSCreators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: null, missingPermissions: null};
    this.onLogin = this.onLogin.bind(this);
    this.checkPermissions = this.checkPermissions.bind(this);
    this.throughFacebook = this.throughFacebook.bind(this);
    this.grant = this.grant.bind(this);
    this.facebookConnected = this.facebookConnected.bind(this);
  }
  onLogin(u) {
    this.setState({currentUser: u});
    this.checkPermissions();
  }
  checkPermissions() {
    TinyShowFacebookApi.getGrantedPermissions(gantedPermissions => {
      var missingPermissions = _.filter(REQUIRED_CREATOR_PERMISSIONS,
        requiredPermission => {
          return gantedPermissions.indexOf(requiredPermission) < 0;
        });
      this.setState({missingPermissions: missingPermissions});
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
    TinyShowApi.getExistingUser(u => {
      if (u['id']) {
        this.setState({currentUser: new TinyShowUser(u)});
        this.onLogin(new TinyShowUser(u));
      } else {
        TinyShowFacebookApi.getCurrentUserProfile(facebookUser => {
          this.setState({currentUser: facebookUser});
          this.onLogin(facebookUser);
        });
      }
    });
  }
  throughFacebook() {
    return this.state.currentUser &&
      this.state.missingPermissions != null &&
      this.state.missingPermissions.length == 0;
  }
  hayMissingPermissions() {
    return this.state.missingPermissions != null &&
      this.state.missingPermissions.length > 0;
  }
  render() {
    return (
      <div>
        <TSNavigation currentUser={this.state.currentUser} />
        <div style={{padding: '20px 0px 40px 60px', width: 600}}>
          {!this.state.currentUser &&
            <div style={{fontSize: 16, marginTop: 8}}>
              <span className="pink">Boost</span> increases your <span className="blue">Facebook</span> event RSVP's by making it <u>super easy</u> for users to respond. Get setup in less than 60 seconds.
            </div>
          }

          {!this.state.currentUser &&
            <TSLoginBox facebookConnected={this.facebookConnected} />
          }

          {this.hayMissingPermissions() &&
            <TSMissingPermissions
              missingPermissions={this.state.missingPermissions}
              onGrant={this.grant}
            />
          }

          {this.throughFacebook() && this.state.currentUser instanceof TinyShowUser &&
            <TSUserSettings user={this.state.currentUser} />
          }

          {this.throughFacebook() && !(this.state.currentUser instanceof TinyShowUser) &&
            <TSUserSettingsEdit user={this.state.currentUser} />
          }
        </div>
      </div>
    )
  }
}

module.exports = TSCreators;
