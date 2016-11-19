import React, {Component} from 'react';

import TSProfileSpot from './TSProfileSpot.jsx';

class TSCreatorStats extends React.Component {
  render() {
    return (
      <div>
        <TSProfileSpot user={this.props.user} />
        <div
          style={{
            padding: 0,
            marginTop: 10,
            color: 'rgb(85, 85,85)',
            textTransform: 'uppercase',
          }}>
          <span
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#eeeeee',
            }}>
            {this.props.user.facebook_pages.length}
          </span>
          &nbsp;&nbsp;&nbsp;pages connected
        </div>
      </div>
    )
  }
}

module.exports = TSCreatorStats;