require "rubygems"
require "bundler"

Bundler.require

require "./app"
use Raven::Rack
run Sinatra::Application
