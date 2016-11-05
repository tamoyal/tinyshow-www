require_relative "tinyshow/api"
require_relative "tinyshow/og_meta"

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
	end
end
