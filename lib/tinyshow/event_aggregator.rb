module TinyShow
  class EventAggregator
    def self.facebook_events(thing)
      begin
        TinyShow::FacebookHelpers.events_for_facebook_id(
          thing.facebook_id,
          thing.facebook_access_token,
        ).map { |e| build_event(e, thing.facebook_id) }
      rescue Koala::Facebook::APIError => ex
        TinyShow.error({
          name: "Koala::Facebook::APIError",
          message: "Error getting events for Facebook ID",
          ex: ex,
          context: {
            facebook_id: thing.facebook_id,
          }
        })
        if thing.is_a?(User)
          TinyShow.send_to_raven(ex, thing)
        elsif thing.is_a?(UserFacebookPage)
          TinyShow.send_to_raven(ex, nil, nil, {
            page_id: thing.id,
            page_facebook_id: thing.facebook_id,
          })
        else
          raise
        end
      end
    end

    private

    def self.build_event(facebook_payload, owner_facebook_id)
      event = FacebookEvent.find_or_initialize_by({
        facebook_id: facebook_payload["id"],
        owner_facebook_id: owner_facebook_id
      })
      event.starts_at = facebook_payload["start_time"]
      event.graph_payload = facebook_payload
      event
    end
  end
end
