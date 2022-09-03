require "uri"
require "json"
require "typhoeus"

class Host
  def self.get
    if ENV["RACK_ENV"] == "development"
      ngrok_host || raise("Start ngrok to use this server in development mode.")
    else
      "www.tinyshow.com"
    end
  end

  private

  def self.ngrok_host
    body = Typhoeus.get("http://127.0.0.1:4040/api/tunnels").body
    return nil if body.empty?
    ngrok_config = JSON.parse(body)
    URI.parse(ngrok_config["tunnels"].first["public_url"]).host
  end
end
