import React, {Component} from 'react';
import TinyShowHelpers from '../../TSHelpers.js';

class TSVerticalCenter extends React.Component {
  render() {
    return (
      <div
        {...this.props}
        style={TSHelpers.mergeObj({
          display: 'flex',
          alignItems: 'center',
        }, this.props.style)}>
        {this.props.children}
      </div>
    )
  }
}

module.exports = TSVerticalCenter;
