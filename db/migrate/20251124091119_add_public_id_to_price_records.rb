class AddPublicIdToPriceRecords < ActiveRecord::Migration[8.0]
  def change
    add_column :price_records, :public_id, :uuid, default: -> { "gen_random_uuid()" }, null: false

    add_index :price_records, :public_id, unique: true
  end
end
