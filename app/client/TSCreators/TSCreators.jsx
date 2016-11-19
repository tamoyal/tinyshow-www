import React, {Component} from 'react';

import TSUser from '../models/TSUser.js';
import TSApi from '../api/TSApi.js';
import TSFacebookHelpers from '../TSFacebookHelpers.js';
import TSData from '../TSData.js';
import TSTopNavBar from '../components/TSTopNavBar.jsx';
import TSLoader from '../components/TSLoader.jsx';
import TSFacebookLogin from './TSFacebookLogin.jsx';
import TSMissingPermissions from './TSMissingPermissions.jsx';
import TSBoostBranding from './TSBoostBranding.jsx';
import TSUserRegistration from './TSUserRegistration.jsx';
import TSBoostMarketing from './TSBoostMarketing.jsx';

class TSCreators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      missingPermissions: null,
      loading: true,
    };
    this.checkPermissions = this.checkPermissions.bind(this);
    this.grant = this.grant.bind(this);
    this.login = this.login.bind(this);
    this.facebookConnected = this.facebookConnected.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
    this.onUserUpdated = this.onUserUpdated.bind(this);
    this.facebookNotConnected = this.facebookNotConnected.bind(this);
  }
  checkPermissions() {
    TSFacebookHelpers.getGrantedPermissions(
      TSData.currentUser.facebookId,
      granted => {
        var missingPermissions = REQUIRED_CREATOR_PERMISSIONS.filter((p) => {
          return granted.indexOf(p) < 0;
        });

        if (missingPermissions.length == 0 && TSData.currentUser.confirmedAt) {
          this.props.router.replace('dash');
        } else {
          this.setState({
            missingPermissions: missingPermissions,
            currentUser: TSData.currentUser,
            loading: false,
          });
        }
      },
      error => {
        if (error.type == "OAuthException") {
          window.location.reload(false);
        } else {
          alert(error.message);
        }
      });
  }
  grant() {
    FB.login(response => {
      this.setState({loading: true});
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
    this.setState({loading: true});
    TSApi.login(
      (user) => {
        TSData.currentUser = new TSUser(user);
        this.checkPermissions();
      },
      (error) => {
        this.setState({loading: false});
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
      <TSFacebookLogin
        facebookConnected={this.facebookConnected}
        facebookNotConnected={this.facebookNotConnected}
      />
    )
  }
  facebookNotConnected() {
    this.setState({loading: false});
  }
  render() {
    return (
      <div>
        <TSTopNavBar>
          <TSBoostBranding />
        </TSTopNavBar>

        <div style={{paddingLeft: 60, paddingRight: 40, width: 800}}>
          {!this.state.loading &&
            <TSBoostMarketing style={{marginTop: 16}} />
          }

          {this.state.loading &&
            <TSLoader style={{marginTop: 60}} />
          }

          <div style={{marginTop: 40, marginBottom: 40}}>
            {this.state.currentUser ? 
              this.renderFacebookAuthenticatedUser() :
              this.renderUnauthenticated()}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = TSCreators;
