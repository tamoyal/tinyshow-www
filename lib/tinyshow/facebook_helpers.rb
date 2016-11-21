module TinyShow
  class FacebookHelpers
    def self.events_for_facebook_id(facebook_id, token)
      graph(token).get_connections(facebook_id, "events")
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
