$:.unshift File.dirname(__FILE__) + "/.."

require "bundler"
Bundler.require(:default)

require "app/workers/aggregate_worker"

module Clockwork
  handler do |job, time|
    TinyShow.log_mode = :clock
    TinyShow.info "Running #{job}, at #{time}"
  end

  every(1.day, 'get_facebook_events', :at => '06:00', :tz => 'EST') do
    w = AggregateWorker.new
    w.perform
    TinyShow.info "Finished get_facebook_events at #{Time.now}"
  end
end
