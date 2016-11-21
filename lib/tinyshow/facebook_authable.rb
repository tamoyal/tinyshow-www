module TinyShow
  module FacebookAuthable
    # Important: This will not refresh tokens that have already expired. So
    # you have to call this before the token expires or users will have to
    # re-login.
    def extend_access_token
      new_access_info = FacebookHelpers.extend_access_token(facebook_access_token)
      TinyShow.debug new_access_info
      self.facebook_access_token = new_access_info["access_token"]
      self.facebook_access_token_expiration = Time.now.utc + new_access_info["expires"].to_i
    end
  end
end
