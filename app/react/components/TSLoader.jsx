import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TSHelpers from '../../TSHelpers.js';

class TSLoader extends React.Component {
  render() {
    var lines = [];
    for (var i = 0; i < 5; ++i)
      lines.push(<div style={{width: 6, height: 100}}></div>);

    return (
      <div
        {...this.props}
        style={this.props.style}>
          <div className="line-scale-pulse-out-rapid">
            {lines}
          </div>
          {this.props.title}
      </div>
    )
  }
}

module.exports = TSLoader;
