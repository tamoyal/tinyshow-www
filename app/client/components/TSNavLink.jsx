import React, {Component} from 'react';

import styles from './TSNavLink.css';

var classNames = require('classnames');

class TSNavLink extends React.Component {
  render() {
    return (
      <a
        {...this.props}
        className={classNames(styles.navLink,
          this.props.selected ? styles.selected : null)}>
        {this.props.children}
      </a>
    )
  }
}

module.exports = TSNavLink
