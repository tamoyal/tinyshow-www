import React, {Component} from 'react';

class TSHelp extends React.Component {
  render() {
    return (
      <div style={this.props.style}>
        <div>Questions, Problems, Ideas?</div>
        <img style={{height: 16}} src="/images/email.png" />
      </div>
    )
  }
}

module.exports = TSHelp;
