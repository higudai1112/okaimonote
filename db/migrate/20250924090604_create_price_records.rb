class CreatePriceRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :price_records do |t|
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.references :shop, null: false, foreign_key: true
      t.integer :price, null: false
      t.text :memo
      t.date :purchased_at, null: false

      t.timestamps
    end
  end
end
