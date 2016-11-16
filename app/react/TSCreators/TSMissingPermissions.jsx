import React, {Component} from 'react';

var TSIconButton = require('../components/TSIconButton.jsx');
var TSWell = require('../components/TSWell.jsx');

class TSMissingPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.doGrant = this.doGrant.bind(this);
  }
  doGrant(e) {
    e.preventDefault();
    this.props.onGrant();
  }
  render() {
    return (
      <TSWell
        title="You must grant these permissions to connect your events to TinyShow"
        style={this.props.style}>
        <ul>
          {this.props.missingPermissions.map((p, k) => {
            return (
              <li key={k}>{p}</li>
            )
          })}
        </ul>
        <TSIconButton
          onClick={this.doGrant}
          title="Grant"
          fontAwesomeIconClass="fa-facebook"
        />
      </TSWell>
    )
  }
}

module.exports = TSMissingPermissions;
