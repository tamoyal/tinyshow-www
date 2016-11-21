require_relative "tinyshow/api"
require_relative "tinyshow/og_meta"
require_relative "tinyshow/facebook_helpers"
require_relative "tinyshow/facebook_authable"
require_relative "tinyshow/event_aggregator"
require_relative "tinyshow/has_facebook_events"

module TinyShow
	class << self
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
			if obj.is_a?(String)
				if level == :warn
					puts "[TinyShow WARN] #{obj}".orange
				elsif level == :error
					puts "[TinyShow ERROR] #{obj}".red
				else
					puts "[TinyShow DEBUG] #{obj}"
				end
			else
				if level == :warn
					puts "[TinyShow WARN]".orange
				elsif level == :error
					puts "[TinyShow ERROR]".red
				else
					puts "[TinyShow DEBUG]"
				end
				ap obj
			end
		end

		def warn(obj)
			debug(obj, :warn)
		end

		def error(obj)
			# TODO: log these in a DB or something
			debug(obj, :error)
		end
	end
end
