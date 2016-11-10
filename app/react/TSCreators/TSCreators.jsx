import React, {Component} from 'react';

var TSLoginBox = require('./TSLoginBox.jsx');
var TSMissingPermissions = require('./TSMissingPermissions.jsx');
var TSUserSettings = require('./TSUserSettings.jsx');
var TSUserSettingsEdit = require('./TSUserSettingsEdit.jsx');

class TSCreators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: null};
    this.onLogin = this.onLogin.bind(this);
  }
  onLogin(u) {
    this.setState({currentUser: u});
  }
  render() {
    return (
      <div style={{padding: '20px 0px 40px 60px', width: 600}}>
        <div style={{fontSize: 40, fontWeight: 200}}>
          TinyShow Connect
        </div>
        <div style={{fontSize: 20}}>
          Connect your <span className="blue">Facebook</span> events to the TinyShow App
        </div>

        <TSLoginBox onLogin={this.onLogin} />

        {this.state.currentUser &&
          <TSMissingPermissions />
        }

        {this.state.currentUser && this.state.currentUser instanceof TinyShowUser &&
          <TSUserSettings user={this.state.currentUser} />
        }

        {this.state.currentUser && !(this.state.currentUser instanceof TinyShowUser) &&
          <TSUserSettingsEdit user={this.state.currentUser} />
        }
      </div>
    )
  }
}

module.exports = TSCreators;
