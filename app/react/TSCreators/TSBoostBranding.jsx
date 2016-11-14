import React, {Component} from 'react';

var TSStyle = require('../../TSStyle.js');

class TSBoostBranding extends React.Component {
  render() {
    return (
      <div style={{fontSize: 34}}>
        <span style={{fontFamily: 'HelveticaNeue-Thin'}}>Tiny</span>
        <span>SHOW</span>
        <span
          style={{
            fontFamily: 'HelveticaNeue',
            marginLeft: 20,
            color: TSStyle.pink,
          }}>
          <i
            style={{marginRight: 6}}
            className="fa fa-bolt"
            aria-hidden="true">
          </i>
          BOOST
        </span>
      </div>
    )
  }
}

module.exports = TSBoostBranding;
