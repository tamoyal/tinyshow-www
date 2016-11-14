class User < ActiveRecord::Base
	has_many :facebook_pages, class_name: 'UserFacebookPage'

  validates_uniqueness_of :facebook_id
  validates_uniqueness_of :email, unless: Proc.new { |u| u.confirmed_at.nil? }

  before_save :nil_if_blank

	NULL_ATTRS = %w(first_name last_name email phone)

  protected

  def nil_if_blank
    NULL_ATTRS.each { |attr| self[attr] = nil if self[attr].blank? }
  end
end
