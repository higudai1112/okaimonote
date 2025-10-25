class ShoppingList < ApplicationRecord
  belongs_to :user
  has_many :shopping_items, dependent: :destroy

  validates :name, presence: true
end
