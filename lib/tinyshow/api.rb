module TinyShow
	class Api
		S3_DATA_FP = "https://s3.amazonaws.com/tinyshow-data/data.json"

		def show(id)
			data.detect{ |event| event["event"]["id"] == id.to_i }
		end

		private

		def data
			@@data ||= JSON.parse(Typhoeus.get(S3_DATA_FP, accept_encoding: "gzip").body)
		end
	end
end
