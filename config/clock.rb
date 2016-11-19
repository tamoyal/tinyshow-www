$:.unshift File.dirname(__FILE__) + "/.."

require "bundler"
Bundler.require(:default)

require "app/workers/aggregate_worker"

module Clockwork
  handler do |job, time|
    puts "Running #{job}, at #{time}"
  end

  every(1.day, 'get_facebook_events', :at => '06:00', :tz => 'EST') do
    AggregateWorker.perform
  end
end
