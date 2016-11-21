$:.unshift File.dirname(__FILE__)

require "sinatra/activerecord/rake"

namespace :db do
  task :load_config do
    require "./app"
  end
end

namespace :work do
  task :get_facebook_events do
    require "app"
    require "app/workers/aggregate_worker"

    TinyShow.log_mode = :clock
    TinyShow.info "Running get_facebook_events, at #{Time.now}"
    w = AggregateWorker.new
    w.perform
    TinyShow.info "Finished get_facebook_events at #{Time.now}"
  end
end
