$:.unshift File.dirname(__FILE__)

require 'config/host'
require 'config/facebook'
require 'lib/tinyshow'
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
	set :views, File.dirname(__FILE__) + '/app/views'
	set :domain, Host.get
	set :iphone_app_store_link, "https://itunes.apple.com/app/tinyshow/id1079542002"
end

configure :development do
  set :logging, Logger::DEBUG
end

configure :test do
  set :logging, Logger::ERROR
end

configure :production do
  set :logging, Logger::INFO
end

helpers do
  def respond(code, body)
  	content_type :json
    status code
    body.to_json
  end
end

before do
	if settings.development?
		puts '[Params]'
		p params
	end
end

get '/' do
	erb :welcome
end

get '/contact-us' do
	erb :contact_us
end

get '/dl' do
	redirect settings.iphone_app_store_link
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
	@required_creator_permissions = REQUIRED_CREATOR_FB_PERMISSIONS
	erb :login
end

post "/login" do
	graph = Koala::Facebook::API.new(params[:facebook_access_token])
	me = graph.get_object("me?fields=#{FACEBOOK_USER_FIELDS.join(",")}")
	if me["id"] == params[:facebook_id]
		t = extend_token(params[:facebook_access_token])
		if t.nil?
			TinyShow.error "TinyShow Login: Could not get long lived access token for #{me["user_id"]}"
			respond(400, {})
		else
			u = User.find_by_facebook_id(me["id"])
			if !u
				u = User.create!({
					facebook_id: me["id"],
					facebook_access_token: t,
					facebook_graph_payload: me,
					email: me["email"],
					first_name: me["first_name"],
					last_name: me["last_name"],
				})
			end
			respond(200, u.as_json(:include => [:facebook_pages]))
		end
	else
		respond(400, {})
	end
end

put "/users" do
	user_attrs = params["user"].dup
	t = user_attrs.delete("auth_token")
	u = User.find_by_facebook_access_token(t)
	if u
		user_attrs["confirmed_at"] = Time.now if user_attrs.delete("confirm") == "1"
		u.update!(user_attrs)

		errors = []
		if params["facebook_pages"]
			params["facebook_pages"].each do |facebook_id, val|
				if val == "false"
					page = u.facebook_pages.find_by_facebook_id(facebook_id)
					page.deactivate if page
				else
					facebook_page = JSON.parse(val)
					t = extend_token(facebook_page["access_token"])
					if t
						attrs = {
							facebook_id: facebook_page["id"],
							facebook_access_token: t,
							graph_payload: val,
							deactivated_at: nil,
						}

						page = UserFacebookPage.where(user: u, facebook_id: facebook_page["id"]).first
						if page
							page.update!(attrs)
						else
							u.facebook_pages.create!(attrs)
						end
					else
						TinyShow.error "Could not get long lived access token for page" if t.nil?
						errors << "Token problem with page '#{facebook_page["id"]}'"
					end
				end
			end
		end

		if errors.empty?
			respond(200, u.reload.as_json(:include => [:facebook_pages]))
		else
			respond(422, {error: errors.join(",")})
		end
	else
		respond(404, {error: "User not found"})
	end
end

# Important: While it took an hour of reading docs to find this out, it turns out
# this is not for refreshing expired tokens. So you have to call this before the
# token expires or users will have to re-login.
def extend_token(token)
	oauth = Koala::Facebook::OAuth.new("847945558672954", "5bb6bcff0a70da76f9820c6d243720bc")
	begin
		new_access_info = oauth.exchange_access_token_info(token)
		if new_access_info["access_token"]
			new_access_info["access_token"]
		else
			TinyShow.warn "Could not refresh access token"
		end
	rescue Koala::Facebook::OAuthTokenRequestError => e
		puts "Koala::Facebook::OAuthTokenRequestError"
		TinyShow.error e
	rescue Koala::Facebook::ServerError => e
		puts "Koala::Facebook::ServerError"
		TinyShow.error e
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
		graph = Koala::Facebook::API.new(page.facebook_access_token)
		events = graph.get_connections(page.facebook_id, "events")
	rescue Koala::Facebook::APIError => e
		puts "Koala::Facebook::APIError:"
		ap e

		refreshed_token = extend_token(page.facebook_access_token)
		if refreshed_token
			page.update_attribute(:facebook_access_token, refreshed_token)
			events = graph.get_connections(page.facebook_id, "events")
		else
			respond(422, {})
		end
	end
	respond(200, events)
end


