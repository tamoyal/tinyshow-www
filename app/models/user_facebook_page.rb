class UserFacebookPage < ActiveRecord::Base
	belongs_to :user

	validates_uniqueness_of :facebook_id, scope: :user_id

  def deactivate
    update_attribute(:deactivated_at, Time.now)
  end
end
