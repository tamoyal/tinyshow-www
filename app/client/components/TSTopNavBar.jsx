import React, {Component} from 'react';

class TSTopNavBar extends React.Component {
  render() {
    return (
      <div
        style={{
          width: '100%',
          padding: '12px 60px 12px 60px',
          backgroundColor: '#222',
          margin: 0,
        }}>
        {this.props.children}
      </div>
    )
  }
}

module.exports = TSTopNavBar;
