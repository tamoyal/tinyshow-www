$:.unshift File.dirname(__FILE__)

require "sinatra/activerecord/rake"

namespace :db do
  task load_config: :environment do
    require "app"
  end
end

load "lib/tasks/work.rake"
