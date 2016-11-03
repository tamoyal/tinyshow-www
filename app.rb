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

get '/existing_user' do
	u = User.where(facebook_id: params["facebookId"]).includes(:facebook_pages)
	ap u
	if u.first
		# TODO: User exists so extend their access token
		content_type :json
    status_code 200
    u.first.to_json(:include => [:facebook_pages])
	else
		respond(200, {})
	end
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

# NOTE: We could store the expiration time and check that
# ...but we'd probably have to handle the error anyway
# ...so should we bother having multiple types of checks?
# ...or just wait for the expiration exception? (this for now)
get '/pages/:id/facebook_events' do
	page = UserFacebookPage.find(params[:id])

	events = nil
	begin
		graph = Koala::Facebook::API.new(page.access_token)
		events = graph.get_connections(page.page_id, "events")
	rescue Koala::Facebook::APIError => e
		puts "Koala::Facebook::APIError:"
		ap e
		if refresh_token_for_page(graph, page)
			events = graph.get_connections(page.page_id, "events")
		else
			respond(422, {})
		end
	end
	respond(200, events)
end

# Important: While it took an hour of reading docs to find this out, it turns out
# this is not for refreshing expired tokens. So you have to call this before the
# token expires or users will have to re-login.
def refresh_token_for_page(graph, page)
	puts "Refreshing access token for #{page}"
	oauth = Koala::Facebook::OAuth.new("847945558672954", "5bb6bcff0a70da76f9820c6d243720bc")
	ap oauth
	new_access_info = oauth.exchange_access_token_info(page.access_token)
	puts "Received new access info:"
	ap new_access_info
	new_access_token = new_access_info["access_token"]
	if new_access_token
		page.access_token = new_access_token
		page.save!
		true
	else
		false
	end
end
