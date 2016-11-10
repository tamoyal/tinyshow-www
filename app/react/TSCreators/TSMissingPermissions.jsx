import React, {Component} from 'react';

class TSMissingPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {missingPermissions: []};
    this.checkPermissions = this.checkPermissions.bind(this);
    this.doGrant = this.doGrant.bind(this);
  }
  checkPermissions() {
    TinyShowFacebookApi.getGrantedPermissions(gantedPermissions => {
      var missingPermissions = _.filter(REQUIRED_CREATOR_PERMISSIONS,
        requiredPermission => {
          return gantedPermissions.indexOf(requiredPermission) < 0;
        });
      this.setState({missingPermissions: missingPermissions});
    });
  }
  doGrant(e) {
    e.preventDefault();
    FB.login(response => {
      this.setState = {missingPermissions: []};
    },
    {
      scope: this.state.missingPermissions.join(','),
      auth_type: 'rerequest'
    });
  }
  componentDidMount() {
    this.checkPermissions();
  }
  render() {
    return (
      <div>
        {this.state.missingPermissions.length > 0 &&
          <div>
            <div>
              You must grant the following permissions to connect your events to TinyShow:
            </div>
            <ul id="permissions_list">
              {this.state.missingPermissions.map((p, k) => {
                return (
                  <li key={k}>{p}</li>
                )
              })}
            </ul>
            <a
              id="do_grant"
              onClick={this.doGrant}
              href="#" >
              Grant &raquo;
            </a>
          </div>
        }
      </div>
    )
  }
}

module.exports = TSMissingPermissions;
