class CreateShoppingItems < ActiveRecord::Migration[8.0]
  def change
    create_table :shopping_items do |t|
      t.string :name, null: false
      t.boolean :purchased, default: false
      t.string :memo
      t.references :shopping_list, null: false, foreign_key: true

      t.timestamps
    end
  end
end
