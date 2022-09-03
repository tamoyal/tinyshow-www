class UserFacebookPage < ApplicationRecord
  include TinyShow::HasFacebookEvents

  belongs_to :user

  validates :facebook_id, uniqueness: { scope: :user_id }

  def deactivate
    update_attribute(:deactivated_at, Time.now)
  end

  def update_from_facebook_payload(payload)
    self.facebook_access_token = payload["access_token"]
    self.graph_payload = payload.to_s
    self.deactivated_at = nil
    save!
  end
end
