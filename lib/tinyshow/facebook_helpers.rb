module TinyShow
  class FacebookHelpers
    def self.events_for_facebook_id(facebook_id, token)
      begin
        events_for_facebook_id!(facebook_id, token)
      rescue Koala::Facebook::APIError => e
        Sidewalk.error e
      end
    end

    def self.events_for_facebook_id!(facebook_id, token)
      graph = Koala::Facebook::API.new(token)
      graph.get_connections(facebook_id, "events")
    end
  end
end
