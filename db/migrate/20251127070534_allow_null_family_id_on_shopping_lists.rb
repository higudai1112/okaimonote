class AllowNullFamilyIdOnShoppingLists < ActiveRecord::Migration[8.0]
  def change
    change_column_null :shopping_lists, :family_id, true
  end
end
