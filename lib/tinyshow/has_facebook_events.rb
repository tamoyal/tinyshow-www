module TinyShow
  module HasFacebookEvents
    def fetch_and_save_facebook_events
      events = TinyShow::EventAggregator.facebook_events(self)
      events.each do |e|
        if !e.save
          TinyShow.error "AggregateWorker/save_event error saving record:\n#{e}"
        end
      end
      update_attribute(:events_fetched_at, Time.now)
      events
    end
  end
end
