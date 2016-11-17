require "app/models/facebook_event"

class AggregateWorker
  def perform
    User.all.each do |user|
      if user.get_events_from_user_fb_account
        TinyShow::FacebookHelpers.events_for_facebook_id(
          user.facebook_id,
          user.facebook_access_token,
        ).each { |e| save_event(e, user.facebook_id) }
      end
      user.facebook_pages.each do |page|
        TinyShow::FacebookHelpers.events_for_facebook_id(
          page.facebook_id,
          page.facebook_access_token,
        ).each { |e| save_event(e, page.facebook_id) }
      end
    end
  end

  private

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
