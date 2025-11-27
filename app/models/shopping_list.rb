class ShoppingList < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :family, optional: true
  has_many :shopping_items, dependent: :destroy

  validates :name, presence: true

  def to_param
    public_id
  end
end
