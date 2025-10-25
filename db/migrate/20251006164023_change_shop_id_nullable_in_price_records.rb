class ChangeShopIdNullableInPriceRecords < ActiveRecord::Migration[8.0]
  def change
    change_column_null :price_records, :shop_id, true
    change_column_default :price_records, :purchased_at, -> { 'CURRENT_DATE' }
  end
end
