class PriceRecord < ApplicationRecord
  belongs_to :product
  belongs_to :shop, optional: true
  belongs_to :user

  validates :price, presence: { message: "を入力してください" }, numericality: { only_integer: true, greater_than: 0 }
  validates :purchased_at, presence: true
  validates :memo, length: { maximum: 200 }, allow_blank: true

  def self.ransackable_attributes(auth_object = nil)
    %w[product_id shop_id]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "product", "shop" ]
  end

  def to_param
    public_id
  end
end
