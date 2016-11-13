import React, {Component} from 'react';

var TSUserSettingsForm = require('./TSUserSettingsForm.jsx');

class TSUserRegistration extends React.Component {
  render() {
    return (
      <div>
        <div style={{textTransform: 'uppercase', fontSize: 20}}>
          Please confirm your information
        </div>
        <div>
          *We review every account so please ensure the email below is correct.
          Phone helps in case we have trouble reaching you via email.
        </div>
        <TSCreatorAccountForm
          user={this.props.curFacebookUser}
          onSettingsSaved={this.onSettingsSaved}>
          <input
            type="hidden"
            name="user[facebook_graph_payload]"
            value={this.props.curFacebookUser.originalPayloadJSON()} />
          <input
            type="hidden"
            name="user[facebook_access_token]"
            value={this.props.curFacebookUser.accessToken} />
        </TSCreatorAccountForm>
      </div>
    )
  }
}

module.exports = TSUserRegistration;
