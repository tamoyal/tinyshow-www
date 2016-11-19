import React, {Component} from 'react';

import TSHelpers from '../TSHelpers.js';
import TSStyle from '../TSStyle.js';

class TSWell extends React.Component {
  render() {
    return (
      <div
        style={TSHelpers.mergeObj({
          border: '1px solid #444444'
        }, this.props.style)}>
        <div
          style={{
            backgroundColor: '#222222',
            color: TSStyle.green,
            padding: '10px 10px 10px 10px',
          }}>
          {this.props.title}
        </div>
        <div style={{padding: '16px 16px 16px 16px'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

module.exports = TSWell;
