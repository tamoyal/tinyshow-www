module TinyShow
  class OGMeta
    attr_accessor :type, :url, :title, :description, :image, :image_width, :image_height

    def initialize(event, domain)
      @type = "article"
      @url = "http://#{domain}/s/#{event["event"]["id"]}"
      @title = "#{event_title(event)} @#{event["venue"]["name"]} - #{formatted_start_time(event)}"
      @description = [
        genres(event),
        event["venue"]["neighborhood"] || event["venue"]["city"],
        "Download the TinyShow iPhone app to listen to the band and explore more shows."
      ].join(" /// ")
      @image = event["venue"]["grayscale_image_url"]
      s = venue_image_size(event)
      @image_width = s[0]
      @image_height = s[1]
    end

    private

    def venue_image_size(event)
      event["venue"]["image_dimensions"].split("x").map(&:to_i)
    end

    def genres(event)
      event["artist"]["genres"].map { |g| "#" + g }.join(" ").downcase
    end

    def event_title(event)
      event["artist"]["name"] || event["event"]["title"]
    end

    def formatted_start_time(event)
      Time.parse(event["event"]["starts_at"]).strftime("%A %m/%d at %l:%M%p")
    end
  end
end
