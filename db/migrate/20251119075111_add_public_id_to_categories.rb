class AddPublicIdToCategories < ActiveRecord::Migration[8.0]
  def change
    add_column :categories, :public_id, :uuid, default: -> { "gen_random_uuid()" }, null: false
    add_index :categories, :public_id, unique: true
  end
end
