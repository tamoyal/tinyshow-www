module TinyShow
  class FacebookHelpers
    # Note: You can't query for events after start time using the graph API
    # so we gotta do some ugly stuff
    def self.events_for_facebook_id(facebook_id, token)
      keep_going = true
      events = []
      last_year = Time.now.year - 1

      res = graph(token).get_connections(facebook_id, "events")
      while res
        res.each do |e|
          if Time.parse(e["start_time"]).year < last_year
            keep_going = false
            break
          else
            events << e
          end
        end
        break unless keep_going
        res = res.next_page
      end

      events
    end

    def self.get_me(token)
      graph(token).get_object("me?fields=#{FACEBOOK_USER_FIELDS.join(",")}")
    end

    def self.get_accounts(facebook_id, token)
      graph(token).get_connections(facebook_id, "accounts")
    end

    def self.extend_access_token(token)
      oauth.exchange_access_token_info(token)
    end

    protected

    def self.graph(token)
      Koala::Facebook::API.new(token)
    end

    def self.oauth
      Koala::Facebook::OAuth.new(ENV["FACEBOOK_CLIENT_ID"], ENV["FACEBOOK_SECRET"])
    end
  end
end
