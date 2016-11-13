import React, {Component} from 'react';

class TSMissingPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.doGrant = this.doGrant.bind(this);
  }
  doGrant(e) {
    e.preventDefault();
    this.props.onGrant();
  }
  render() {
    return (
      <div
        className="well"
        style={{
          backgroundColor: '#222',
          border: 'none',
        }}>
        <div>
          <h2>Important!</h2>

          <div>
            You must grant the following permissions to connect your events to TinyShow:
          </div>

          <ul>
            {this.props.missingPermissions.map((p, k) => {
              return (
                <li key={k}>{p}</li>
              )
            })}
          </ul>

          <TSIconButton
            onClick={this.doGrant}
            title="Grant"
            fontAwesomeIconClass="fa-facebook"
          />
        </div>
      </div>
    )
  }
}

module.exports = TSMissingPermissions;
