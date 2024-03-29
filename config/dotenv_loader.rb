class DotenvLoader
  def self.load(env_file)
    if File.exist?(env_file)
      Rails.logger.debug { "Loading environment variables from '#{env_file}'" }
      File.read(env_file).lines do |line|
        key, value = line.split("=")
        next if value.nil? || key.start_with?("#")
        ENV[key] ||= value.strip
      end
    else
      Rails.logger.debug { "Warning: No .env file found at '#{env_file}'" }
    end
  end
end

env_file = File.expand_path("../.#{ENV["RACK_ENV"]}.env", File.dirname(__FILE__))
DotenvLoader.load(env_file)
