class AddPublicIdToProducts < ActiveRecord::Migration[8.0]
  def change
    # UUIDカラムを追加（デフォルトで gen_random_uuid() が入る）
    add_column :products, :public_id, :uuid, default: -> { "gen_random_uuid()" }, null: false

    # 検索＆一意制約用のインデックス
    add_index :products, :public_id, unique: true
  end
end
