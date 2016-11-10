import React, {Component} from 'react';

var TSVerticalCenter = require('../components/TSVerticalCenter.jsx');

class TSUserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {allFacebookPages: []};
  }
  componentDidMount() {
    TinyShowFacebookApi.getPagesList(facebookPages => {
      this.setState({allFacebookPages: facebookPages});
    });
  }
  render() {
    var selectedPages = [];

    if (this.state.allFacebookPages.length > 0) {
      var selectedIds = _.map(this.props.user.facebook_pages, page => {
        return page['facebook_id'];
      });
      selectedPages = _.filter(this.state.allFacebookPages, page => {
        return selectedIds.indexOf(page.id) >= 0;
      });
    }

    return (
      <div>
        {selectedPages.length > 0
          ?
            <div>
              <h4>Your Pages</h4>
              <ul style={{listStyle: 'none'}}>
                {selectedPages.map((p, k) => {
                  return (
                    <li>
                      <TSVerticalCenter style={{height: 54}}>
                        <img
                          style={{
                            margin: '0px 6px 0px 6px',
                            width: 48,
                          }}
                          src={p.pictureUrl} />
                        <div style={{display: 'inline'}}>{p.name}</div>
                      </TSVerticalCenter>
                    </li>
                  )
                })}
              </ul>
            </div>
          :
            <div>
              You have connected 0 Facebook pages for TinyShow to pull events from.
            </div>
        }

        {this.props.user.get_events_from_user_fb_account &&
          <div>Your user account is setup for TinyShow to pull events from.</div>
        }
      </div>
    )
  }
}

module.exports = TSUserSettings;
