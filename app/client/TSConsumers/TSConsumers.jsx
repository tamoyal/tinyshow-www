import React, {Component} from 'react';

class TSConsumers extends React.Component {
	render() {
		return (
			<div>
				<div className="top-banner">
					<a href={this.props.settings.iphone_app_store_link}>
						Listen to the band &amp; explore more shows with the free TinyShow iPhone app &raquo;
					</a>
				</div>

				<div id="main_content">
					<div
						className="fb-share-button"
						data-href={this.props.og.url}
						data-layout="button"
						size="large"
					/>

					<div className="artist-details">
						<div className="huge-font">{this.props.event.title}</div>
						<div
							className="big-font"
							style={{marginTop: 6}}>
							@{this.props.event.event.venue.name}
						</div>
						<div className="big-font green" style={{marginTop: 2}}>
							{this.props.event.genres}
						</div>
					</div>

					<div className="big-font start-time">
						<i className="fa fa-arrow-right" aria-hidden="true"></i>
						{this.props.event.formatted_start_time}
						<i className="fa fa-arrow-left" aria-hidden="true"></i>
					</div>

					<iframe
					  width="400"
					  height="300"
					  frameBorder="0"
					  style={{border:0}}
					  src={"https://www.google.com/maps/embed/v1/place?key=" +
							this.props.settings.google_maps_api_key + "&q=" +
							this.props.event.google_maps_query}
					  allowFullScreen>
					</iframe>

					<div>
						<img src={this.props.og.image} />
					</div>
				</div>
			</div>
		)
	}
}

module.exports = TSConsumers;
