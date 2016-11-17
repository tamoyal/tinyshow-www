import React, {Component} from 'react';
import styles from './TSFormResult.css';

var classNames = require('classnames');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var TSStyle = require('../../TSStyle.js');

class TSHappyFace extends React.Component {
  render() {
    return (
      <i
        className="fa fa-smile-o"
        style={{
          fontSize: 36,
          marginLeft: 20,
          color: TSStyle.green,
        }}>
        {this.props.children}
      </i>
    )
  }
}

class TSSadFace extends React.Component {
  render() {
    return (
      <i
        className="fa fa-frown-o"
        style={{
          fontSize: 36,
          marginLeft: 20,
          color: TSStyle.red,
        }}>
        {this.props.children}
      </i>
    )
  }
}

// TODO: I'm thinking the below would have been better without
// ReactCSSTransitionGroup goodies...
class TSFormResult extends React.Component {
  render() {
    var mode;
    if (this.props.error) {
      mode = 'error';
    } else if (this.props.success) {
      mode = 'success';
    }

    return (
      <ReactCSSTransitionGroup
        transitionName={styles}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={300}>
        {mode == 'success' &&
          <div
            className={classNames(styles.delayedFadeOut)}
            style={{display: 'flex', alignItems: 'flex-end'}}>
            <TSHappyFace key={1} />
          </div>
        }
        {mode == 'error' &&
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <TSSadFace key={2} />
            <div
              style={{
                fontSize: 13,
                marginLeft: 10,
                color: TSStyle.red,
                textTransform: 'uppercase',
              }}>
              {this.props.error}
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

module.exports = TSFormResult;
