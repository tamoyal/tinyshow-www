import React, {Component} from 'react';
import TSStyle from '../TSStyle.js';
import TSTag from '../components/TSTag.jsx';

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

					<div style={{marginTop: 20, marginBottom: 20}}>
						<div
							style={{
								fontSize: 48,
								fontFamily: "HelveticaNeue-Thin",
							}}>
							{this.props.event.title}
						</div>
						<div
							style={{
								fontSize: 16,
								fontFamily: "HelveticaNeue-Light",
								marginBottom: 10,
							}}>
							{this.props.event.formatted_start_time}
						</div>

						{this.props.event.genres.map((g, k) => {
	            return (
	              <TSTag key={k} title={g} />
	            )
	          })}
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
