import React, {Component} from 'react';

class LoginBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {authenticated: false};
  }
  render() {
    return (
      <div>
        {this.state.authenticated &&
          <div>
            <img src={this.props.pictureUrl} />
            <div className="logged-in-name">
              Logged in as: <span class="blue">{this.props.fullName}</span>
            </div>
          </div>
        }
        <div style={{display: this.state.authenticated ? 'none' : 'block'}}>
          Unauthenticated
        </div>
      </div>
    )
  }
};

module.exports = LoginBox;
