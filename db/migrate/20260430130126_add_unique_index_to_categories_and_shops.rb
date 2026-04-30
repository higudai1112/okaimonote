class AddUniqueIndexToCategoriesAndShops < ActiveRecord::Migration[8.0]
  def change
    add_index :categories, [ :user_id, :name ], unique: true,
              name: "index_categories_on_user_id_and_name"
    add_index :shops, [ :user_id, :name ], unique: true,
              name: "index_shops_on_user_id_and_name"
  end
end
