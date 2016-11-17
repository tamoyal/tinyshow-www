import React, {Component} from 'react';
import ReactDOM from 'react-dom';

var TSStyle = require('../../TSStyle.js');
var TSFacebookHelpers = require('../../TSFacebookHelpers.js');
var TSPageList = require('./TSPageList.jsx');
var TSVerticalCenter = require('../components/TSVerticalCenter.jsx');
var TSFormResult = require('../components/TSFormResult.jsx');
var TSProgressButton = require('../components/TSProgressButton.jsx');

class TSCreatorEventSourcesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      loaded: false,
      success: null,
      error: null,
      facebookPages: [],
      get_events_from_user_fb_account:
        this.props.user.get_events_from_user_fb_account || false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    this.setState({saving: true, success: null, error: null});
    e.preventDefault();
    TinyShowApi.updateUser(
      $(ReactDOM.findDOMNode(this.refs.eventSourcesForm)).serialize(),
      (response) => {
        this.setState({saving: false, success: 1});
        this.props.onSettingsSaved(new TinyShowUser(response));
      },
      (xhr) => {
        console.log(xhr);
        var error;
        if (xhr.status >= 500) {
          error = "Something unexpected went wrong, we're looking into it.";
        } else {
          error = xhr.statusText;
        }
        this.setState({saving: false, error: error});
      });
  }
  componentDidMount() {
    TSFacebookHelpers.getPagesList(
      this.props.user.facebookId,
      facebookPages => {
        this.setState({loaded: true, facebookPages: facebookPages});
      },
      error => {
        if (error.type == "OAuthException") {
          this.props.onAuthError();
        } else {
          alert(error.message);
        }
      });
  }
  render() {
    return (
      <div>
        {this.state.loaded &&
          <form
            ref="eventSourcesForm"
            method="POST"
            onSubmit={this.onSubmit}>
            {this.props.title &&
              <div
                style={{
                  color: TSStyle.green,
                  marginBottom: 10,
                  fontSize: 20,
                  textTransform: 'uppercase',
                }}>
                {this.props.title}
              </div>
            }

            <TSVerticalCenter style={{height: 36}}>
              <label>
                <input
                  defaultChecked={this.state.get_events_from_user_fb_account}
                  name="user[get_events_from_user_fb_account]"
                  value="true"
                  type="checkbox" />
                <div style={{display: 'inline', margin: '0px 10px 0px 10px'}}>
                  Pull events from my user account
                </div>
              </label>
            </TSVerticalCenter>

            {this.state.loaded && this.state.facebookPages.length > 0 &&
              <TSPageList
                pages={this.state.facebookPages}
                selectedPageIds={
                  this.props.user.facebook_pages.map((p) => {
                    return p['facebook_id'];
                  })
                }
                title="Select your facebook pages that have events:"
                withCheckbox="true"
              />
            }

            {this.state.loaded && this.state.facebookPages.length == 0 &&
              <div>
                You have no facebook pages to pull events from.&nbsp;
                <a href="/contact-us">Does this seem wrong?</a>
              </div>
            }

            <input
              name="user[auth_token]"
              type="hidden"
              value={this.props.user.auth_token}
            />

            <div style={{display: 'flex', height: 40, marginTop: 20}}>
              <TSProgressButton
                type="submit"
                text="Save"
                loadingText="Saving"
                loading={this.state.saving}
                style={{width: 120}}
              />
              <TSFormResult
                error={this.state.error}
                success={this.state.success}
              />
            </div>
          </form>
        }

        {!this.state.loaded &&
          <div>Loading Facebook Pages...</div>
        }
      </div>
    )
  }
}

module.exports = TSCreatorEventSourcesForm;
