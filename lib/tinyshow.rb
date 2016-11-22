require_relative "tinyshow/api"
require_relative "tinyshow/og_meta"
require_relative "tinyshow/facebook_helpers"
require_relative "tinyshow/facebook_authable"
require_relative "tinyshow/event_aggregator"
require_relative "tinyshow/has_facebook_events"

module TinyShow
	class << self
		@@log_mode = :app

		def log_mode=(mode)
      @@log_mode = mode
    end

    def log_mode
      @@log_mode
    end

		def send_to_raven(ex, user, request=nil, extra_context=nil)
			if user
				ctx = {id: user.id, email: user.email}
				ctx[:ip_address] = request.ip if request
				Raven.user_context(ctx)
			end
			Raven.extra_context(extra_context) if extra_context
			Raven.capture_exception(ex)
			Raven::Context.clear!
		end

		def debug(obj, level=:debug)
			prefix = 	if log_mode == :clock
									"TinyShow#Clock"
								else
									"TinyShow"
								end
			if obj.is_a?(String)
				if level == :warn
					puts "[#{prefix} WARN] #{obj}".orange
				elsif level == :error
					puts "[#{prefix} ERROR] #{obj}".red
				elsif level == :info
					puts "[#{prefix} INFO] #{obj}".white
				else
					puts "[#{prefix} DEBUG] #{obj}"
				end
			else
				if level == :warn
					puts "[#{prefix} WARN]".orange
				elsif level == :error
					puts "[#{prefix} ERROR]".red
				elsif level == :info
					puts "[#{prefix} INFO]".white
				else
					puts "[#{prefix} DEBUG]"
				end
				ap obj
			end
		end

		def info(obj)
			debug(obj, :info)
		end

		def warn(obj)
			debug(obj, :warn)
		end

		def error(obj)
			debug(obj, :error)
		end

		def exception(ex, context=nil)
			hsh = {
				name: "#{ex.class}",
				message: ex.message,
				ex: ex,
			}
			hsh[:context] = context if context
			debug(hsh, :error)
		end
	end
end
