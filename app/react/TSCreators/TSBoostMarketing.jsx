import React, {Component} from 'react';

var TSHelpers = require('../../TSHelpers.js');
var TSStyle = require('../../TSStyle.js');

class TSBoostMarketing extends React.Component {
  render() {
    return (
      <div
        style={TSHelpers.mergeObj({
          fontSize: 16,
        }, this.props.style)}>
        <span
          style={{
            color: TSStyle.pink,
            fontSize: 26,
            textTransform: 'uppercase',
          }}>
          Boost
        </span> increases your <span style={{color: TSStyle.lightBlue}}>facebook</span> event RSVP's:
        <ul style={{marginBottom: 0}}>
          <li>We encourage "interested" responses to boost your event in facebook news feeds.</li>
          <li>We provide a seamless one tap responses in the TinyShow app.</li>
        </ul>
      </div>
    )
  }
}

module.exports = TSBoostMarketing;