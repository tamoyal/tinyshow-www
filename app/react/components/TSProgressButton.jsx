import React, {Component} from 'react';

var TSStyle = require('../../TSStyle.js');

class TSProgressButton extends React.Component {
  render() {
    return (
      <button
        type={this.props.type || 'button'}
        disabled={this.props.loading}
        className="btn btn-default"
        style={this.props.style}>
        {this.props.loading ? this.props.loadingText + '...' : this.props.text}
      </button>
    )
  }
}

module.exports = TSProgressButton;
