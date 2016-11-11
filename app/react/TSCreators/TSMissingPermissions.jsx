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

          <ul id="permissions_list">
            {this.props.missingPermissions.map((p, k) => {
              return (
                <li key={k}>{p}</li>
              )
            })}
          </ul>

          <button
            onClick={this.doGrant}
            type="button"
            className="btn btn-default"
            ariaLabel="Left Align"
            style={{
              backgroundColor: '#26499f',
              color: 'white',
              border: 'none',
            }}>
            <i
              className="fa fa-facebook"
              ariaHidden="true"
              style={{marginRight: 8}}>
            </i>
            Grant
          </button>
        </div>
      </div>
    )
  }
}

module.exports = TSMissingPermissions;
