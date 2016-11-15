import React, {Component} from 'react';

var TSVerticalCenter = require('../components/TSVerticalCenter.jsx');

class TSPageList extends React.Component {
  renderImage(page) {
    return (
      <img
        style={{
          margin: '0px 10px 0px 10px',
          width: 48,
        }}
        src={page.pictureUrl}
      />
    )
  }
  renderPageName(page) {
    return <div style={{display: 'inline'}}>{page.name}</div>;
  }
  renderListContent(page) {
    if (this.props.withCheckbox) {
      return (
        <TSVerticalCenter style={{height: 54}} className="checkbox">
          <label>
            <input
              name={'facebook_pages['+page.id+']'}
              type="hidden"
              value="false"
            />
            <input
              defaultChecked={this.props.selectedPageIds &&
                this.props.selectedPageIds.indexOf(page.id) >= 0}
              name={'facebook_pages['+page.id+']'}
              value={page.originalPayloadJSON()}
              type="checkbox"
            />
            {this.renderImage(page)}
            {this.renderPageName(page)}
          </label>
        </TSVerticalCenter>
      )
    } else {
      return (
        <TSVerticalCenter style={{height: 54}}>
          {this.renderImage(page)}
          {this.renderPageName(page)}
        </TSVerticalCenter>
      )
    }
  }
  render() {
    return (
      <div>
        <label>{this.props.title}</label>
        <ul
          style={{
            listStyle: 'none',
            marginTop: '6px 0px 0px 0px',
            padding: 0,
          }}>
          {this.props.pages.map((p, k) => {
            return (
              <li key={k}>
                {this.renderListContent(p)}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

module.exports = TSPageList;
