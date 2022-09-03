class FacebookEvent < ApplicationRecord
  validates :facebook_id, uniqueness: { scope: :owner_facebook_id }

  scope :future, -> { where(["starts_at > ?", Time.now]) }
end
