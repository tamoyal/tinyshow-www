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
require 'app/models/facebook_event'
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
	erb :login
end

post "/login" do
	graph = Koala::Facebook::API.new(params[:facebook_access_token])
	me = graph.get_object("me?fields=#{FACEBOOK_USER_FIELDS.join(",")}")

	if me["id"] == params[:facebook_id]
		u = User.find_by_facebook_id(me["id"]) ||
			User.new({
				facebook_id: me["id"],
				facebook_access_token: params[:facebook_access_token],
				facebook_access_token_expiration: params[:facebook_access_token_expiration],
				facebook_graph_payload: me,
				email: me["email"],
				first_name: me["first_name"],
				last_name: me["last_name"],
			})
		error = u.extend_access_token
		if error.nil?
			u.save!
			u.update_pages
			respond(200, u.as_json({
				include: [:facebook_pages],
				methods: :upcoming_facebook_events_count,
			}))
		else
			TinyShow.error "TinyShow Login: Could not get long lived access token for #{me["id"]}"
			respond(400, {})
		end
	else
		respond(400, {})
	end
end

put "/users" do
	user_attrs = params["user"].dup
	t = user_attrs.delete("auth_token")
	u = User.includes(:facebook_pages).find_by_facebook_access_token(t)
	if u
		user_attrs["confirmed_at"] = Time.now if user_attrs.delete("confirm") == "1"
		u.update!(user_attrs)
		
		if u.get_events_from_user_fb_account && u.events_fetched_at.nil?
			u.fetch_and_save_facebook_events
		end

		if params["facebook_pages"]
			params["facebook_pages"].each do |facebook_id, val|
				if val == "false"
					page = u.facebook_pages.find_by_facebook_id(facebook_id)
					page.deactivate if page
				else
					facebook_page = JSON.parse(val)
					page = u.facebook_pages.find_by_facebook_id(facebook_page["id"])
					page = UserFacebookPage.new({
						user: u,
						facebook_id: facebook_page["id"],
					}) if page.nil?
					page.facebook_access_token = facebook_page["access_token"]
					page.graph_payload = val
					page.deactivated_at = nil
					page.save!

					page.fetch_and_save_facebook_events if page.events_fetched_at.nil?						
				end
			end
		end

		respond(200, u.reload.as_json({
			include: [:facebook_pages],
			methods: :upcoming_facebook_events_count,
		}))
	else
		respond(404, {error: "User not found"})
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

get '/users/:id/facebook_events/giourewbgubgogb2bgiurgbir' do
	user = User.find(params[:id])
	begin
		events = TinyShow::FacebookHelpers.events_for_facebook_id!(
			user.facebook_id,
	    user.facebook_access_token,
		)
		respond(200, events)
	rescue Koala::Facebook::APIError => e
		respond(422, {})
	end
end

get '/pages/:id/facebook_events/giourewbgubgogb2bgiurgbir' do
	page = UserFacebookPage.find(params[:id])
	begin
		events = TinyShow::FacebookHelpers.events_for_facebook_id!(
			page.facebook_id,
	    page.facebook_access_token,
		)
		respond(200, events)
	rescue Koala::Facebook::APIError => e
		respond(422, {})
	end
end
