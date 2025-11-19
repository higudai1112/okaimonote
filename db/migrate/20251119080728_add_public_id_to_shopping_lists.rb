class AddPublicIdToShoppingLists < ActiveRecord::Migration[8.0]
  def change
    add_column :shopping_lists, :public_id, :uuid, default: -> { "gen_random_uuid()" }, null: false

    add_index :shopping_lists, :public_id, unique: true
  end
end
