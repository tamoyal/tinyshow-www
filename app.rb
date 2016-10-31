require 'json'
require 'typhoeus'
require 'uri'

class TinyShowAPI
	def show(id)
		data.detect{ |event| event["event"]["id"] == id.to_i }
	end

	private

	def data
		@@data ||= JSON.parse(Typhoeus.get("https://s3.amazonaws.com/tinyshow-data/data.json", accept_encoding: "gzip").body)
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
	# TODO: change this to the actual link
	set :iphone_app_store_link, "/dl"
end

get '/' do
	erb :welcome
end

get '/dl' do
	# TODO: forward to the iTunes download page
	erb :welcome
end

# get '/login' do
# 	erb :login
# end

get '/s/:id' do
	api = TinyShowAPI.new
	@event = api.show(params[:id])
	@venue_image_size = @event["venue"]["image_dimensions"].split("x").map(&:to_i)
	erb :show
end

get '/local_data' do
	# for simulating a bad connection
	# sleep 10
	File.read('./public/data/BALTIMORE-10-23-2016-READY.json')
end
