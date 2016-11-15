import React, {Component} from 'react';

var TSCreatorStats = require('./TSCreatorStats.jsx');
var TSCreatorAccountForm = require('./TSCreatorAccountForm.jsx');
var TSCreatorEventSourcesForm = require('./TSCreatorEventSourcesForm.jsx');
var TSTabbedNavigation = require('../components/TSTabbedNavigation.jsx');

class TSCreatorsDashboard extends React.Component {
  render() {
    return (
      <TSTabbedNavigation>
        <TSCreatorStats title="Home" user={this.props.currentUser} />
        <TSCreatorAccountForm
          title="Account Settings"
          user={this.props.currentUser}
          onSettingsSaved={this.props.onUserUpdated} />
        <TSCreatorEventSourcesForm
          title="Event Sources"
          user={this.props.currentUser}
          onSettingsSaved={this.props.onUserUpdated}
        />
      </TSTabbedNavigation>
    )
  }
}

module.exports = TSCreatorsDashboard;
