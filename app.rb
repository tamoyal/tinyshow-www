$:.unshift File.dirname(__FILE__)

ENV["RACK_ENV"] ||= "development"

require "json"
require "typhoeus"
require "uri"
require "sinatra"
require "sinatra/reloader" if development?
require "sinatra/activerecord"
require "awesome_print"
require "koala"

require "config/dotenv_loader"
require "config/host"
require "config/facebook"
require "config/google_maps"
require "lib/tinyshow"
require "app/models/user"
require "app/models/user_facebook_page"
require "app/models/facebook_event"
require "app/presenters/event_presenter"

Tilt.register Tilt::ERBTemplate, "html.erb"

Koala::Utils.level = Logger::DEBUG

configure do
  set :views, File.dirname(__FILE__) + "/app/views"
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

  def facebook_authenticate
    TinyShow::FacebookHelpers.get_me(params[:facebook_access_token]).tap do |me|
      halt 400 unless me["id"] == params[:facebook_id]
    end
  end

  def send_to_raven(ex, user, extra_context = nil)
    TinyShow.send_to_raven(ex, user, request, extra_context)
  end
end

before do
  if settings.development?
    puts "[Params]"
    p params
  end
end

get "/" do
  erb :welcome
end

get "/contact-us" do
  erb :contact_us
end

get "/dl" do
  redirect settings.iphone_app_store_link
end

get "/s/:id" do
  @settings = {
    iphone_app_store_link: settings.iphone_app_store_link,
    google_maps_api_key: ENV["GOOGLE_MAPS_API_KEY"]
  }.to_json
  api = TinyShow::Api.new
  event = api.show(params[:id])
  @e = EventPresenter.new(event)
  @og = TinyShow::OGMeta.new(event, settings.domain)
  erb :show
end

get "/local_data" do
  File.read("./public/data/BALTIMORE-10-23-2016-READY.json")
end

get "/creators" do
  erb :login
end

post "/login" do
  me = facebook_authenticate
  u = User.find_by(facebook_id: me["id"])
  if !u
    u = User.new({
      facebook_id: params[:facebook_id],
      facebook_access_token: params[:facebook_access_token],
      facebook_access_token_expiration: params[:facebook_access_token_expiration],
      email: me["email"],
      first_name: me["first_name"],
      last_name: me["last_name"],
      facebook_graph_payload: me
    })
    u.save!(validate: false)
  end

  begin
    u.extend_access_token
  rescue Koala::Facebook::OAuthTokenRequestError => ex
    send_to_raven(ex, u)
    TinyShow.exception(ex, {
      user_id: u.id,
      facebook_access_token: u.facebook_access_token
    })
    halt 400, "Bad facebook credentials"
  rescue Koala::Facebook::ServerError => ex
    send_to_raven(ex, u)
    TinyShow.exception(ex)
    halt 500, "Server error"
  rescue Koala::KoalaError => ex
    send_to_raven(ex, u)
    TinyShow.exception(ex)
    halt 503, "Unknown error"
  end

  u.save!
  u.update_pages
  respond(200, u.as_json({
    include: [:facebook_pages],
    methods: :upcoming_facebook_events_count
  }))
end

put "/users" do
  user_attrs = params["user"].dup
  t = user_attrs.delete("auth_token")
  u = User.includes(:facebook_pages).find_by(facebook_access_token: t)
  if u
    user_attrs["confirmed_at"] = Time.now if user_attrs.delete("confirm") == "1"

    if !u.update(user_attrs)
      halt 422, u.errors.to_json
    end

    if u.get_events_from_user_fb_account && u.events_fetched_at.nil?
      u.fetch_and_save_facebook_events
    end

    params["facebook_pages"]&.each do |facebook_id, val|
      if val == "false"
        page = u.facebook_pages.find_by(facebook_id: facebook_id)
        page&.deactivate
      else
        facebook_page = JSON.parse(val)
        page = u.facebook_pages.find_by(facebook_id: facebook_page["id"]) ||
          UserFacebookPage.new({
            user: u,
            facebook_id: facebook_page["id"]
          })
        page.update_from_facebook_payload(facebook_page)
        page.fetch_and_save_facebook_events if page.events_fetched_at.nil?
      end
    end

    respond(200, u.reload.as_json({
      include: [:facebook_pages],
      methods: :upcoming_facebook_events_count
    }))
  else
    respond(404, { error: "User not found" })
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

get "/users/:id/facebook_events/giourewbgubgogb2bgiurgbir" do
  user = User.find(params[:id])
  events = TinyShow::EventAggregator.facebook_events(user)
  respond(200, events)
end

get "/pages/:id/facebook_events/giourewbgubgogb2bgiurgbir" do
  page = UserFacebookPage.find(params[:id])
  events = TinyShow::EventAggregator.facebook_events(page)
  respond(200, events)
end
