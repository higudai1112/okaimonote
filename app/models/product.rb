class Product < ApplicationRecord
  belongs_to :category, optional: true
  has_many :price_records, dependent: :destroy
end
