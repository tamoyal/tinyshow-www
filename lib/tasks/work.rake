desc "Aggregate events from TinyShow artists facebook user accounts and facebook pages"
namespace :work do
  task get_facebook_events: :environment do
    require "app"
    require "app/workers/aggregate_worker"

    TinyShow.log_mode = :clock
    TinyShow.info "Running get_facebook_events, at #{Time.now}"
    w = AggregateWorker.new
    w.perform
    TinyShow.info "Finished get_facebook_events at #{Time.now}"
  end
end
