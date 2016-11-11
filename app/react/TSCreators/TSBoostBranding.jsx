import React, {Component} from 'react';

class TSBoostBranding extends React.Component {
  render() {
    return (
      <div style={{fontSize: 34}}>
        <span style={{fontFamily: 'HelveticaNeue-Thin'}}>Tiny</span>
        <span>SHOW</span>
        <span
          className="pink"
          style={{
            fontFamily: 'HelveticaNeue',
            marginLeft: 20,
          }}>
          <i
            style={{marginRight: 2}}
            className="fa fa-bolt"
            aria-hidden="true">
          </i>
          boost
        </span>
      </div>
    )
  }
}

module.exports = TSBoostBranding;
