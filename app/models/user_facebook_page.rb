class UserFacebookPage < ActiveRecord::Base
	belongs_to :user

	validates_uniqueness_of :page_id, scope: :user_id
end
