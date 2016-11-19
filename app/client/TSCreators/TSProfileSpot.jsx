import React, {Component} from 'react';

import TSVerticalCenter from '../components/TSVerticalCenter.jsx';
import TSStyle from '../TSStyle.js';
import TSHelpers from '../TSHelpers.js';

class ProfileIconFacebook extends React.Component {
  render() {
    return (
      <div
        style={TSHelpers.mergeObj({
          backgroundColor: TSStyle.darkBlue,
          width: 20,
          height: 20,
          borderRadius: 10,
          border: '1px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }, this.props.style)}>
        <i
          className="fa fa-facebook"
          aria-hidden="true"
          style={{fontSize: 10}}>
        </i>
      </div>
    )
  }
}

class TSProfileSpot extends React.Component {
  render() {
    return (
      <TSVerticalCenter>
        <div
          style={{
            position: 'relative',
            width: 52,
            height: 52,
          }}>
          <img
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: 25,
            }}
            src={this.props.user.pictureUrl}
          />
          <ProfileIconFacebook
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0
            }} 
          />
        </div>
        <div
          style={{
            color: TSStyle.green,
            textTransform: 'uppercase',
            paddingLeft: 10,
          }}>
          {this.props.user.firstName}
        </div>
      </TSVerticalCenter>
    )
  }
}

module.exports = TSProfileSpot;
