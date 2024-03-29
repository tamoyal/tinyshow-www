import React, {Component} from 'react';

import TSCreatorAccountForm from './TSCreatorAccountForm.jsx';
import TSCreatorEventSourcesForm from './TSCreatorEventSourcesForm.jsx';
import TSStyle from '../TSStyle.js';
import TSData from '../TSData.js';
import TSWell from '../components/TSWell.jsx';

class TSUserRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {step: 1, currentUser: null};
    this.stepOneComplete = this.stepOneComplete.bind(this);
    this.stepTwoComplete = this.stepTwoComplete.bind(this);
    this.wellTitle = this.wellTitle.bind(this);
  }
  stepOneComplete(user) {
    TSData.currentUser = user;
    this.setState({step: 2, currentUser: user});
  }
  stepTwoComplete(user) {
    TSData.currentUser = user;
    this.props.onRegistered();
  }
  wellTitle() {
    var title = "STEP " + this.state.step + " / 2 - ";
    if (this.state.step == 1) {
      return title + "CONFIRM INFO";
    } else if (this.state.step == 2) {
      return title + "ADD EVENT SOURCES";
    }
  }
  render() {
    return (
      <TSWell title={this.wellTitle()} style={this.props.style}>
        {this.state.step == 1 &&
          <div>
            <TSCreatorAccountForm
              user={this.props.currentUser}
              onSettingsSaved={this.stepOneComplete}
            />
          </div>
        }
        {this.state.step == 2 &&
          <TSCreatorEventSourcesForm
            onSettingsSaved={this.stepTwoComplete}
            user={this.state.currentUser}
          />
        }
      </TSWell>
    )
  }
}

module.exports = TSUserRegistration;
