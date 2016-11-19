import React, {Component} from 'react';

import TSProfileSpot from './TSProfileSpot.jsx';

class TSCreatorStat extends React.Component {
  render() {
    return (
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
          {this.props.amount}
        </span>
        &nbsp;&nbsp;&nbsp;{this.props.things}
      </div>
    )
  }
}

class TSCreatorStats extends React.Component {
  render() {
    return (
      <div>
        <TSProfileSpot user={this.props.user} />
        <TSCreatorStat
          amount={this.props.user.facebook_pages.length}
          things="pages connected"
        />
        <TSCreatorStat
          amount={this.props.user.upcomingEventsCount}
          things="upcoming events"
        />
      </div>
    )
  }
}

module.exports = TSCreatorStats;
