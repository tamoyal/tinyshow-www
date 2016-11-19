class FacebookEvent < ActiveRecord::Base
  validates_uniqueness_of :facebook_id, scope: :owner_facebook_id

  scope :future, -> { where(["starts_at > ?", Time.now]) }
end
