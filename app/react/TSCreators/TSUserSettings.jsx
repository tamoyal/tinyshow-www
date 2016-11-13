import React, {Component} from 'react';

var TSIconButton = require('../components/TSIconButton.jsx');
var TSPageList = require('./TSPageList.jsx');
var TSFacebookHelpers = require('../../TSFacebookHelpers.js');

class TSUserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedPages: []};
  }
  componentDidMount() {
    if (this.props.user.facebook_pages.length > 0) {
      TSFacebookHelpers.getPagesList(facebookPages => {
        if (facebookPages.length > 0) {
          var selectedIds = this.props.user.facebook_pages.map((p) => {
            return p['facebook_id'];
          });
          var selectedPages = facebookPages.filter((p) => {
            return selectedIds.indexOf(p.id) >= 0;
          });
          this.setState({selectedPages: selectedPages});
        }
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.selectedPages.length > 0 ?
          <TSPageList
            pages={this.state.selectedPages}
            title="Your Pages"
          /> : 
          <div>
            You have connected 0 Facebook pages for TinyShow to pull events from.
          </div>
        }

        {this.props.user.get_events_from_user_fb_account &&
          <div>Your user account is setup for TinyShow to pull events from.</div>
        }

        <TSIconButton
          onClick={this.props.onEdit}
          title="Edit Settings"
          fontAwesomeIconClass="fa-pencil"
        />
      </div>
    )
  }
}

module.exports = TSUserSettings;
