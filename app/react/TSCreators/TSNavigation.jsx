import React, {Component} from 'react';

var TSBoostBranding = require('./TSBoostBranding.jsx');
var TSProfileSpot = require('./TSProfileSpot.jsx');

class TSNavigation extends React.Component {
  render() {
    return (
      <div
        className="row"
        style={{
          width: '100%',
          padding: '12px 60px 12px 60px',
          backgroundColor: '#222',
          margin: 0,
        }}>
        <div className="col-lg-10 col-md-10">
          <TSBoostBranding />
        </div>
        <div className="col-lg-2 col-md-2">
          {this.props.currentUser &&
            <TSProfileSpot user={this.props.currentUser} />
          }
        </div>
      </div>
    )
  }
}

module.exports = TSNavigation;
