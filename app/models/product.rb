class Product < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :user
  has_many :price_records, dependent: :destroy

  validates :name, presence: true

  def self.ransackable_attributes(auth_object = nil)
    %w[id name memo category_id user_id created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[category user price_records]
  end
end
