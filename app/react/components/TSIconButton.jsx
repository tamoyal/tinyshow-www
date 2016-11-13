import React, {Component} from 'react';

var TSStyle = require('../../TSStyle.js');

class TSIconButton extends React.Component {
  render() {
    return (
      <button
        {...this.props}
        type="button"
        className="btn btn-default"
        ariaLabel="Left Align"
        style={{
          backgroundColor: TSStyle.darkBlue,
          color: TSStyle.white,
          border: 'none',
        }}>
        <i
          className={"fa " + this.props.fontAwesomeIconClass}
          ariaHidden="true"
          style={{marginRight: 8}}>
        </i>
        {this.props.title}
      </button>
    )
  }
}

module.exports = TSIconButton;
