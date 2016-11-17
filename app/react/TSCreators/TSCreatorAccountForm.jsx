import React, {Component} from 'react';
import ReactDOM from 'react-dom';

var TSProgressButton = require('../components/TSProgressButton.jsx');
var TSFormResult = require('../components/TSFormResult.jsx');
var TSStyle = require('../../TSStyle.js');

class TSCreatorAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      success: null,
      error: null,
      data: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        phone: this.props.user.phone,
      },
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    this.setState({saving: true, success: null, error: null});
    e.preventDefault();
    TinyShowApi.updateUser(
      $(ReactDOM.findDOMNode(this.refs.accountForm)).serialize(),
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
  render() {
    return (
      <form
        ref="accountForm"
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

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="user[first_name]"
            defaultValue={this.state.data.firstName}
            type="text"
            className="form-control"
            placeholder="First Name" />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="user[last_name]"
            defaultValue={this.state.data.lastName}
            type="text"
            className="form-control"
            placeholder="Last Name" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="user[email]"
            defaultValue={this.state.data.email}
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Email" />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="user[phone]"
            defaultValue={this.state.data.phone}
            type="phone"
            className="form-control"
            aria-describedby="phoneHelp"
            placeholder="Phone" />
          <small id="phoneHelp" className="form-text text-muted">
            It's good to have another contact method if there are problems with your account.
          </small>
        </div>

        <input
          name="user[auth_token]"
          type="hidden"
          value={this.props.user.auth_token}
        />

        <input
          name="user[confirm]"
          type="hidden"
          value="1"
        />

        <div style={{display: 'flex', height: 40}}>
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
    )
  }
}

module.exports = TSCreatorAccountForm;
