import React, {Component} from 'react';

var TSVerticalCenter = require('../components/TSVerticalCenter.jsx');

class TSProfileSpot extends React.Component {
  render() {
    return (
      <TSVerticalCenter>
        <div style={{fontSize: 18, paddingRight: 4}}>
          <span className="blue">
            {this.props.user.firstName}
          </span>
        </div>
        <img src={this.props.user.pictureUrl} />
      </TSVerticalCenter>
    )
  }
}

module.exports = TSProfileSpot;
