import React, {Component} from 'react';
import ReactDOM from 'react-dom';

var TSVerticalCenter = require('../components/TSVerticalCenter.jsx');

class TSUserSettingsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      facebookPages: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    TinyShowFacebookApi.getPagesList(facebookPages => {
      this.setState({loaded: true, facebookPages: facebookPages});
    });
  }
  onSubmit(e) {
    e.preventDefault();
    var form = ReactDOM.findDOMNode(this.refs.confirmForm);
    $.ajax({
      url: '/users',
      data: $(form).serialize(),
      type: 'POST',
      dataType: 'json',
      success: function(response) {
        console.log(response);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }
  render() {
    return (
      <div>
        {this.state.loaded &&
          <div>
            <div style={{textTransform: 'uppercase', fontSize: 20}}>
              Please confirm your information
            </div>
            <div>
              *We review every account so please ensure the email below is correct.
              Phone helps in case we have trouble reaching you via email.
            </div>
            <form
              ref="confirmForm"
              method="POST"
              onSubmit={this.onSubmit}
              style={{marginTop: 20}}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="user[first_name]"
                  defaultValue={this.props.user.firstName}
                  type="text"
                  className="form-control"
                  placeholder="First Name" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="user[last_name]"
                  defaultValue={this.props.user.lastName}
                  type="text"
                  className="form-control"
                  placeholder="Last Name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="user[email]"
                  defaultValue={this.props.user.email}
                  type="email"
                  className="form-control"
                  placeholder="Email" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="user[phone]"
                  defaultValue={this.props.user.phone}
                  type="phone"
                  className="form-control"
                  placeholder="Phone" />
              </div>
              <label>Where should we pull events from?</label>
              <TSVerticalCenter style={{height: 54}} className="checkbox">
                <label>
                  <input
                    name="user[get_events_from_user_fb_account]"
                    value="true"
                    type="checkbox" />
                  <div style={{display: 'inline'}}>
                    Pull events from my user account
                  </div>
                </label>
              </TSVerticalCenter>
              <div>Select pages:</div>
              <ul style={{listStyle: 'none'}}>
                {this.state.facebookPages.map((p, k) => {
                  <li key={k}>
                    <TSVerticalCenter style={{height: 54}} className="checkbox">
                      <label>
                        <input
                          name={'facebookPages['+p.id+']'}
                          value={p.originalPayloadJSON}
                          type="checkbox" />
                        <img
                          style={{
                            margin: '0px 6px 0px 6px',
                            width: 48,
                          }}
                          src={p.pictureUrl} />
                        <div style={{display: 'inline'}}>{p.name}</div>
                      </label>
                    </TSVerticalCenter>
                  </li>
                })}
              </ul>
              <input
                type="hidden"
                name="user[facebook_graph_payload]"
                value={this.props.user.originalPayloadJSON()} />
              <input
                type="hidden"
                name="user[facebook_access_token]"
                value={this.props.user.accessToken} />
              <button type="submit" className="btn btn-default">Confirm</button>
            </form>
          </div>
        }
      </div>
    )
  }
}

module.exports = TSUserSettingsEdit;
