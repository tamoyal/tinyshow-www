$:.unshift File.dirname(__FILE__) + "/.."

require "bundler"
Bundler.require(:default)

require "app/workers/aggregate_worker"

module Clockwork
  #, :at => '06:00', :tz => 'EST'
  every(5.minutes, 'get_facebook_events') do
    TinyShow.log_mode = :clock
    TinyShow.info "Running get_facebook_events, at #{Time.now}"
    w = AggregateWorker.new
    w.perform
    TinyShow.info "Finished get_facebook_events at #{Time.now}"
  end
end
