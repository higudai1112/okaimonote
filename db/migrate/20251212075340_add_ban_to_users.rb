class AddBanToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :banned, :boolean, default: false, null: false
    add_column :users, :banned_reason, :text
  end
end
