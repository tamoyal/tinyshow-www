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
require 'koala'

Tilt.register Tilt::ERBTemplate, 'html.erb'

Koala::Utils.level = Logger::DEBUG

configure do
	set :domain, Host.get
	set :iphone_app_store_link, "/dl" # TODO: change this to the actual link
end

helpers do
  def respond(code, body)
  	content_type :json
    status_code code
    body.to_json
  end
end

get '/' do
	erb :welcome
end

get '/dl' do
	erb :welcome # TODO: forward to the iTunes download page
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

get '/creators' do
	erb :login
end

post '/users' do
	u = User.find_by_email(params["user"]["email"])
	if u
		respond(422, {error: "User already exists"})
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
			respond(201, {})
		else
			respond(422, u.errors)
		end
	end
end

# Webhooks - Let's worry about this later

# post 'hooks/user_events' do
# 	halt 400 unless params["hub"]["verify_token"] == "16abd4f9-3b72-4b09-b452-8a47b952bffe"
# 	ap params
# 	200
# end

# get 'hooks/user_events' do
# 	halt 400 unless params["hub"]["verify_token"] == "16abd4f9-3b72-4b09-b452-8a47b952bffe"
# 	ap params
# 	status_code 200
# 	params["hub"]["challenge"]
# end

# Admin routes, for debugging
# https://developers.facebook.com/docs/graph-api/reference/event

get '/users/:id/facebook_events' do
	user = User.find(params[:id])
	graph = Koala::Facebook::API.new(user.facebook_access_token)
	events = graph.get_connections("me", "events")
	respond(200, events)
end

get '/pages/:id/facebook_events' do
	page = UserFacebookPage.find(params[:id])
	graph = Koala::Facebook::API.new(page.access_token)
	events = graph.get_connections(page.page_id, "events")
	respond(200, events)
end
