import React, {Component} from 'react';

import TSHelpers from '../TSHelpers.js';
import TSStyle from '../TSStyle.js';

class TSProgressButton extends React.Component {
  render() {
    return (
      <button
        type={this.props.type || 'button'}
        disabled={this.props.loading}
        className="btn btn-default"
        style={TSHelpers.mergeObj({
          backgroundColor: 'buttonface'
        }, this.props.style)}>
        {this.props.loading ? this.props.loadingText + '...' : this.props.text}
      </button>
    )
  }
}

module.exports = TSProgressButton;
