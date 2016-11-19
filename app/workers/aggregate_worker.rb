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
        get_and_save_events(user.facebook_id, user.facebook_access_token)
      end
      user.facebook_pages.each do |page|
        TinyShow.debug "Aggregating events for UserFacebookPage#<#{page.id}>"
        get_and_save_events(page.facebook_id, page.facebook_access_token)
      end
    end
  end

  private

  def get_and_save_events(facebook_id, facebook_access_token)
    TinyShow::FacebookHelpers.events_for_facebook_id(
      facebook_id,
      facebook_access_token,
    ).each { |e| save_event(e, facebook_id) }
  end

  def save_event(facebook_payload, owner_facebook_id)
    event = FacebookEvent.find_or_initialize_by({
      facebook_id: facebook_payload["id"],
      owner_facebook_id: owner_facebook_id
    })
    event.starts_at = facebook_payload["start_time"]
    event.graph_payload = facebook_payload
    if !event.save
      TinyShow.error "AggregateWorker/save_event error saving record:\n#{event}"
    end
  end
end
