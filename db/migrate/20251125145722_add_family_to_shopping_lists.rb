class AddFamilyToShoppingLists < ActiveRecord::Migration[8.0]
  def change
    add_reference :shopping_lists, :family, foreign_key: true
  end
end
