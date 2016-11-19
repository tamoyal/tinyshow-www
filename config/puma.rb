threads ENV["PUMA_MIN_THREADS"] || 5, ENV["PUMA_MAX_THREADS"] || 5
workers ENV["PUMA_WORKERS"] || 2
preload_app!

port        ENV['PORT']     || 3000
environment ENV["RACK_ENV"] || "development"

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
