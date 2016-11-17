import React, {Component} from 'react';

var TSNavLink = require('../components/TSNavLink.jsx');

class TSTabbedNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedIndex: 0};
    this.selectIndex = this.selectIndex.bind(this);
  }
  selectIndex(i) {
    this.setState({selectedIndex: i});
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}>
        <ul className="nav nav-pills nav-stacked">
          {this.props.children.map((component, k) => {
            return (
              <li key={k} role="presentation">
                <TSNavLink
                  selected={this.state.selectedIndex == k}
                  onClick={() => {this.selectIndex(k)}}>
                  {component.props.title}
                </TSNavLink>
              </li>
            )
          })}
        </ul>
        <div style={{paddingLeft: 40,  width: '100%'}}>
          {this.props.children[this.state.selectedIndex]}
        </div>
      </div>
    )
  }
}

module.exports = TSTabbedNavigation;
