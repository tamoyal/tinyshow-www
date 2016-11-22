class User < ActiveRecord::Base
  include TinyShow::FacebookAuthable
  include TinyShow::HasFacebookEvents

	has_many :facebook_pages,
    -> { where deactivated_at: nil },
    class_name: "UserFacebookPage"

  validates_uniqueness_of :facebook_id
  validates_uniqueness_of :email, unless: Proc.new { |u| u.confirmed_at.nil? }
  validates :first_name, presence: true, allow_blank: false
  validates :last_name, presence: true, allow_blank: false
  validates_format_of :email, :with => /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/
  validates :phone,
    allow_blank: true,
    numericality: true,
    length: {minimum: 10, maximum: 15}

  before_save :nil_if_blank

	NULL_ATTRS = %w(first_name last_name email phone)

  def phone=(num)
    num.gsub!(/\D/, "") if num.is_a?(String)
    super(num)
  end

  def upcoming_facebook_events_count
    upcoming_facebook_events.count
  end

  def upcoming_facebook_events
    my_facebook_ids = facebook_pages.pluck(:facebook_id) << facebook_id
    FacebookEvent.where(owner_facebook_id: my_facebook_ids).future
  end

  def update_pages
    accounts = TinyShow::FacebookHelpers.get_accounts(facebook_id, facebook_access_token)
    facebook_pages.each do |page|
      account = accounts.detect { |a| a["id"] == page.facebook_id }
      account ? page.update_from_facebook_payload(account) : page.deactivate
    end
  end

  protected

  def nil_if_blank
    NULL_ATTRS.each { |attr| self[attr] = nil if self[attr].blank? }
  end
end
