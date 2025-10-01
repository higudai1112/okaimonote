class PriceRecord < ApplicationRecord
  belongs_to :product
  belongs_to :shop, optional: true
  belongs_to :user

  validates :price, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :purchased_at, presence: true
  validates :memo, length: { maximum: 200 }, allow_blank: true

  def self.ransackable_attributes(auth_object = nil)
    %w[id price memo purchased_at product_id shop_id user_id created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    ["product", "shop", "user"]
  end
end
