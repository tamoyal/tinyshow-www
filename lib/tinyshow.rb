require_relative "tinyshow/api"
require_relative "tinyshow/og_meta"
require_relative "tinyshow/facebook_authable"
require_relative "tinyshow/facebook_helpers"

module TinyShow
	class << self
		def debug(obj, level=:debug)
			if obj.is_a?(String)
				if level == :warn
					puts "[WARN] #{obj}".orange
				elsif level == :error
					puts "[ERROR] #{obj}".red
				else
					puts "[DEBUG] #{obj}"
				end
			else
				if level == :warn
					puts "[WARN]".orange
				elsif level == :error
					puts "[ERROR]".red
				else
					puts "[DEBUG]"
				end
				ap obj
			end
		end

		def warn(obj)
			debug(obj, :warn)
		end

		def error(obj)
			debug(obj, :error)
		end
	end
end
