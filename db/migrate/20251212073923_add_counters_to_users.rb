class AddCountersToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :products_count, :integer, default: 0, null: false
    add_column :users, :price_records_count, :integer, default: 0, null: false
  end
end
