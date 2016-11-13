import React, {Component} from 'react';
import ReactDOM from 'react-dom';

var TSStyle = require('../../TSStyle.js');

class TSCreatorAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        phone:
          typeof this.props.user.phone === 'undefined'
          ? '' : this.props.user.phone,
      }
    };
  }
  onSubmit(e) {
    e.preventDefault();
    var form = ReactDOM.findDOMNode(this.refs.accountForm);
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
  render() {
    return (
      <form
        ref="accountForm"
        method="POST"
        onSubmit={this.onSubmit}>
        <div
          style={{
            color: TSStyle.green,
            marginBottom: 10,
            fontSize: 20,
          }}>
          ACCOUNT SETTINGS
        </div>

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
            ariaDescribedby="emailHelp"
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
            ariaDescribedby="phoneHelp"
            placeholder="Phone" />
          <small id="phoneHelp" className="form-text text-muted">
            It's good to have another contact method if there are problems with your account.
          </small>
        </div>

        {this.props.children}

        <button type="submit" className="btn btn-default">Save</button>
      </form>
    )
  }
}

module.exports = TSCreatorAccountForm;
