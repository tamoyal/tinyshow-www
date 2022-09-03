# IMPORTANT: We're not using clock procs now because we don't need 100%
# reliability and it's cheaper to use the scheduler
$:.unshift File.dirname(__FILE__) + "/.."

require "bundler"
Bundler.require(:default)

require "app/workers/aggregate_worker"

module Clockwork
  every(1.day, "get_facebook_events", at: "06:00", tz: "EST") do
    TinyShow.log_mode = :clock
    TinyShow.info "Running get_facebook_events, at #{Time.now}"
    w = AggregateWorker.new
    w.perform
    TinyShow.info "Finished get_facebook_events at #{Time.now}"
  end
end
