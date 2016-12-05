import React, {Component} from 'react';
import TSStyle from '../TSStyle.js';

class TSTag extends React.Component {
	render() {
		return (
			<div
				style={{
					color: TSStyle.green,
					border: '1px solid ' + TSStyle.green,
					padding: '4px 8px 4px 8px',
					margin: '0px 4px 4px 0px',
					textTransform: 'uppercase',
					display: 'inline-block',
					fontSize: 12,
				}}>
				{this.props.title}
			</div>
		)
	}
}

module.exports = TSTag;
