module TinyShow
  module FacebookAuthable
    # Important: While it took an hour of reading docs to find this out, it turns out
    # this will not refresh tokens that have already expired. So you have to call this
    # before the token expires or users will have to re-login.
    def extend_access_token
      oauth = Koala::Facebook::OAuth.new("847945558672954", "5bb6bcff0a70da76f9820c6d243720bc")
      begin
        new_access_info = oauth.exchange_access_token_info(facebook_access_token)
        TinyShow.debug new_access_info

        if new_access_info["access_token"]
          self.facebook_access_token = new_access_info["access_token"]
          nil
        else
          TinyShow.warn "Could not refresh access token"
          true
        end
      rescue Koala::Facebook::OAuthTokenRequestError => e
        TinyShow.error "Koala::Facebook::OAuthTokenRequestError:\n#{e}"
        e
      rescue Koala::Facebook::ServerError => e
        TinyShow.error "Koala::Facebook::ServerError\n#{e}"
        e
      end
    end
  end
end
