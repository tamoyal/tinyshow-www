import React, {Component} from 'react';
import TSHelpers from '../../TSHelpers.js';

class TSLoader extends React.Component {
  render() {
    return (
      <div
        {...this.props}
        style={TSHelpers.mergeObj({
          color: '#ff0000',
        }, this.props.style)}>
        {this.props.title || "Loading..."}
      </div>
    )
  }
}

module.exports = TSLoader;
