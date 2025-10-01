class Shop < ApplicationRecord
  belongs_to :user
  has_many :price_records, dependent: :nullify

  validates :name, presence: true, uniqueness: { scope: :user_id }
end
