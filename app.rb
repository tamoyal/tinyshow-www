$:.unshift File.dirname(__FILE__)

require 'config/host'
require 'lib/tinyshow/api'
require 'lib/tinyshow/og_meta'
require 'json'
require 'typhoeus'
require 'uri'
require 'sinatra'
require 'sinatra/activerecord'
require 'awesome_print'
require 'app/models/user'
require 'app/models/user_facebook_page'

Tilt.register Tilt::ERBTemplate, 'html.erb'

configure do
	set :domain, Host.get
	set :iphone_app_store_link, "/dl" # TODO: change this to the actual link
end

get '/' do
	erb :welcome
end

get '/dl' do
	erb :welcome # TODO: forward to the iTunes download page
end

get '/creators' do
	erb :login
end

get '/s/:id' do
	api = TinyShow::Api.new
	@event = api.show(params[:id])
	@og = TinyShow::OGMeta.new(@event, settings.domain)
	erb :show
end

get '/local_data' do
	File.read('./public/data/BALTIMORE-10-23-2016-READY.json')
end

post '/users' do
	u = User.find_by_email(params["user"]["email"])
	if u
		status 422
		{error: "User already exists"}.to_json
	else
		u = User.new(params["user"])

		user_fb_payload = JSON.parse(params["user"]["facebook_graph_payload"])
		u.facebook_id = user_fb_payload["id"]

		params["facebookPages"].each do |facebook_id, json|
			facebook_page = JSON.parse(json)
			u.facebook_pages.build({
				page_id: facebook_page["id"],
				access_token: facebook_page["access_token"],
				graph_payload: json,
			})
		end

		if u.save
			status 201
			{}.to_json
		else
			status 422
			u.errors.to_json
		end
	end
end
