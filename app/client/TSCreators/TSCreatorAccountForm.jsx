import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import TSUser from '../models/TSUser.js';
import TSApi from '../api/TSApi.js';
import TSProgressButton from '../components/TSProgressButton.jsx';
import TSFormResult from '../components/TSFormResult.jsx';
import TSStyle from '../TSStyle.js';

class TSCreatorAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      success: null,
      error: null,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      phone: props.user.phone,
      email: props.user.email,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      firstName: nextProps.user.firstName,
      lastName: nextProps.user.lastName,
      phone: nextProps.user.phone,
      email: nextProps.user.email,
    });
  }
  errorMessageFromResponse(responseText) {
    var errors = JSON.parse(responseText);
    // First error for now
    var k = Object.keys(errors)[0];
    var v = errors[k][0];
    return k + " " + v;
  }
  onSubmit(e) {
    this.setState({saving: true, success: null, error: null});
    e.preventDefault();
    TSApi.updateUser(
      $(ReactDOM.findDOMNode(this.refs.accountForm)).serialize(),
      (response) => {
        var u = new TSUser(response);
        this.setState({saving: false, success: 1});
        this.props.onSettingsSaved(u);
      },
      (xhr) => {
        var errorMessage;
        if (xhr.status >= 500) {
          errorMessage = "Something unexpected went wrong, we're looking into it.";
        } else {
          if (xhr.responseText.length > 0) {
            errorMessage = this.errorMessageFromResponse(xhr.responseText);
          } else {
            errorMessage = xhr.statusText;
          }
        }
        this.setState({saving: false, error: errorMessage});
      });
  }
  handleChange(e) {
    var change = {};
    change[e.target.id] = e.target.value;
    this.setState(change);
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
            value={this.state.firstName}
            onChange={this.handleChange}
            type="text"
            className="form-control"
            placeholder="First Name" />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="user[last_name]"
            value={this.state.lastName}
            onChange={this.handleChange}
            type="text"
            className="form-control"
            placeholder="Last Name" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="user[email]"
            value={this.state.email}
            onChange={this.handleChange}
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
            value={this.state.phone}
            onChange={this.handleChange}
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
