import React, {Component} from 'react';

import TSCreatorStats from './TSCreatorStats.jsx';
import TSCreatorAccountForm from './TSCreatorAccountForm.jsx';
import TSCreatorEventSourcesForm from './TSCreatorEventSourcesForm.jsx';
import TSTabbedNavigation from '../components/TSTabbedNavigation.jsx';
import TSData from '../TSData.js';
import TSTopNavBar from '../components/TSTopNavBar.jsx';
import TSBoostBranding from './TSBoostBranding.jsx';

class TSCreatorsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: TSData.currentUser};
    this.onUserUpdated = this.onUserUpdated.bind(this);
    this.onAuthError = this.onAuthError.bind(this);
  }
  onUserUpdated(user) {
    TSData.currentUser = user;
    this.setState({currentUser: user});
  }
  componentDidMount() {
    // I don't think this works, maybe FB is not initted yet? but it should be!
    // FB.Event.subscribe('auth.logout', response => {
    //   this.props.router.replace('/');
    // });
  }
  onAuthError() {
    this.props.router.replace('/');
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
              onAuthError={this.onAuthError}
            />
          </TSTabbedNavigation>
        </div>
      </div>
    )
  }
}

module.exports = TSCreatorsDashboard;
