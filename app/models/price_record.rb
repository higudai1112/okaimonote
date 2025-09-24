class PriceRecord < ApplicationRecord
  belongs_to :product
  belongs_to :shop
  belongs_to :user

  validates :price, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :purchased_at, presence: true
end
