require "lib/tinyshow"
require "app/models/user"
require "app/models/facebook_event"
require "app/models/user_facebook_page"

class AggregateWorker
  def perform
    User.all.each do |user|
      TinyShow.debug "Aggregating events for User#<#{user.id}>"
      if user.get_events_from_user_fb_account
        TinyShow.debug "Aggregating events from the user account"
        events = user.fetch_and_save_facebook_events
        TinyShow.debug "#{events.count} events found"
      end
      user.facebook_pages.each do |page|
        TinyShow.debug "Aggregating events for UserFacebookPage#<#{page.id}>"
        events = page.fetch_and_save_facebook_events
        TinyShow.debug "#{events.count} events found"
      end
    end
  end
end
