class Contact < ApplicationRecord
  enum :status, { unread: 0, pending: 1, resolved: 2 }

  validates :nickname, :email, :body, presence: true

  def self.ransackable_attributes(auth_object = nil)
    %w[nickname email body status created_at]
  end
end
