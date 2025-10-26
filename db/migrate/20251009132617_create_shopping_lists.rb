class CreateShoppingLists < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_lists do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true
      t.string :shared_token

      t.timestamps
    end

    add_index :shopping_lists, :shared_token, unique: true
  end
end
