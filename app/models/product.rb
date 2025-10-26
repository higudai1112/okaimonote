class Product < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :user
  has_many :price_records, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id }

  def self.ransackable_attributes(auth_object = nil)
    %w[name memo category_id ]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[category price_records]
  end
end
