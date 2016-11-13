import React, {Component} from 'react';
import ReactDOM from 'react-dom';

var TSStyle = require('../../TSStyle.js');
var TSFacebookHelpers = require('../../TSFacebookHelpers.js');
var TSPageList = require('./TSPageList.jsx');
var TSVerticalCenter = require('../components/TSVerticalCenter.jsx');

class TSCreatorEventSourcesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      facebookPages: [],
      get_events_from_user_fb_account:
          typeof this.props.user.get_events_from_user_fb_account === 'undefined'
          ? false : this.props.user.get_events_from_user_fb_account,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    var form = ReactDOM.findDOMNode(this.refs.eventSourcesForm);
    $.ajax({
      url: '/users',
      data: $(form).serialize(),
      type: 'POST',
      dataType: 'json',
      success: response => {
        this.props.onSettingsSaved(response);
      },
      error: (xhr, textStatus, errorThrown) => {
        console.log(errorThrown);
      }
    });
  }
  componentDidMount() {
    TSFacebookHelpers.getPagesList(facebookPages => {
      this.setState({loaded: true, facebookPages: facebookPages});
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
            <div
              style={{
                color: TSStyle.green,
                marginBottom: 10,
                fontSize: 20,
              }}>
              EVENT SOURCES
            </div>

            <TSVerticalCenter style={{height: 54}}>
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

            <TSPageList
              pages={this.state.facebookPages}
              title="Select your facebook pages that have events:"
              withCheckbox="true"
            />

            <button type="submit" className="btn btn-default">Save</button>
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
