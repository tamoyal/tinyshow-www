import React, {Component} from 'react';

var TSCreatorStats = require('./TSCreatorStats.jsx');
var TSCreatorAccountForm = require('./TSCreatorAccountForm.jsx');
var TSCreatorEventSourcesForm = require('./TSCreatorEventSourcesForm.jsx');
var TSTabbedNavigation = require('../components/TSTabbedNavigation.jsx');
var TSData = require('../../TSData.js');
var TSTopNavBar = require('../components/TSTopNavBar.jsx');
var TSBoostBranding = require('./TSBoostBranding.jsx');

class TSCreatorsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: TSData.currentUser};
    this.onUserUpdated = this.onUserUpdated.bind(this);
  }
  onUserUpdated(user) {
    TSData.currentUser = user;
    this.setState({currentUser: user});
  }
  render() {
    return (
      <div>
        <TSTopNavBar>
          <TSBoostBranding />
        </TSTopNavBar>
        <div
          style={{
            padding: '40px 40px 40px 0px',
            width: 800,
          }}>
          <TSTabbedNavigation>
            <TSCreatorStats
              title="Home"
              user={this.state.currentUser} />

            <TSCreatorAccountForm
              title="Account Settings"
              user={this.state.currentUser}
              onSettingsSaved={this.onUserUpdated} />

            <TSCreatorEventSourcesForm
              title="Event Sources"
              user={this.state.currentUser}
              onSettingsSaved={this.onUserUpdated}
            />
          </TSTabbedNavigation>
        </div>
      </div>
    )
  }
}

module.exports = TSCreatorsDashboard;
