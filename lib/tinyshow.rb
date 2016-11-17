require_relative "tinyshow/api"
require_relative "tinyshow/og_meta"
require_relative "tinyshow/facebook_authable"

module TinyShow
	class << self
		def debug(obj)
			if obj.is_a?(String)
				puts obj
			else
				ap obj
			end
		end

		def warn(obj)
			debug(obj)
		end

		def error(obj)
			debug(obj)
		end
	end
end
