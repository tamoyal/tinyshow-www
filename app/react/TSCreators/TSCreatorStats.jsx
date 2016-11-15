import React, {Component} from 'react';
var TSProfileSpot = require('./TSProfileSpot.jsx');

class TSCreatorStats extends React.Component {
  render() {
    return (
      <div>
        <TSProfileSpot user={this.props.user} />
        <ul style={{padding: 0, marginTop: 10}}>
          <li>You have {this.props.user.facebook_pages.length} pages connected to TinyShow Boost</li>
          <li>TinyShow has boosted 17 of your events</li>
        </ul>
      </div>
    )
  }
}

module.exports = TSCreatorStats;
