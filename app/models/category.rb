class Category < ApplicationRecord
  belongs_to :user
  has_many :products, dependent: :nullify
  has_many :price_records, through: :products

  validates :name, presence: true, uniqueness: { scope: :user_id }

  def self.ransackable_attributes(auth_object = nil)
    %w[name memo]
  end
end
