class Category < ApplicationRecord
  belongs_to :user
  has_many :products, dependent: :nullify
  has_many :price_records, dependent: :nullify

  validates :name, presence: true, uniqueness: true
end
