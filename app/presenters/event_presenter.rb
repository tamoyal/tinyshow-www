class EventPresenter
  attr_reader :event, :title, :venue, :google_maps_query, :formatted_start_time, :genres

  def initialize(event)
    @event = event
    @title = event["artist"]["name"] || event["event"]["title"]
    @venue = event["venue"]
    address_lines = [
      @venue["street_address"],
      "#{@venue["city"]}, #{@venue["region_abbr"]} #{@venue["postal_code"]}",
      @venue["neighborhood"]
    ]
    @google_maps_query = @venue["name"] + ", " +
      address_lines[0] + ", " +
      address_lines[1]
    @formatted_start_time = Time.parse(event["event"]["starts_at"])
      .strftime("%A %m/%d at %l:%M%p")
    @genres = @event["artist"]["genres"]
  end
end
