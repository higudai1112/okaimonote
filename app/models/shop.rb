class Shop < ApplicationRecord
  belongs_to :user
  has_many :price_records, dependent: :nullify

  validates :name, presence: true, uniqueness: { scope: :user_id }

  def self.ransackable_attributes(auth_object = nil)
    %w[name memo]
  end
end
