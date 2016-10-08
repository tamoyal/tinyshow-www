require 'json'
require 'typhoeus'
require 'uri'
require 'fastimage'

# Facebook OG wants us to give them the size of the image
# Otherwise they will have to async process it so the image
# may not be available at the first share.
# See more here: https://developers.facebook.com/docs/sharing/best-practices/#precaching
# If we decide on a standard size for venue images, we can remove this code
class VenueImageSizeCache
	def self.get_size(venue_id)
		@data ||= {}
		@data[venue_id] || calc_size(venue_id)
	end

	def self.calc_size(venue_id)
		@data[venue_id] = FastImage.size("./public/images/venues/8x10Outside.jpg")
	end
end

class TinyShowAPI
	def show(id)
		data.detect{ |event| event["event"]["id"] == id.to_i }
	end

	private

	def data
		@@data ||= JSON.parse(Typhoeus.get("https://s3.amazonaws.com/tinyshow-data/data.json").body)
	end
end

class EnvironmentManager
	def self.get_domain_for_dev_env(env)
		if env == "development"
			get_open_ngrok_domain || raise("Start ngrok to use this server in development mode.")
		else
			"tinyshow-www.herokuapp.com"
			# Coming soon:
			#"www.tinyshow.com"
		end
	end

	private

	def self.get_open_ngrok_domain
		body = Typhoeus.get("http://127.0.0.1:4040/api/tunnels").body
		return nil if body.empty?
		ngrok_config = JSON.parse(body)
		URI.parse(ngrok_config["tunnels"].first["public_url"]).host
	end
end

Tilt.register Tilt::ERBTemplate, 'html.erb'

configure do
	set :domain, EnvironmentManager.get_domain_for_dev_env(ENV['RACK_ENV'])
end

get '/' do
	erb :login
end

get '/s/:id' do
	api = TinyShowAPI.new
	@event = api.show(params[:id])
	@venue_image_size = VenueImageSizeCache.get_size(@event["venue"]["id"])
	erb :show
end

get '/local_data' do
	File.read('./public/data/BALTIMORE-09-21-2016-READY.json')
end
