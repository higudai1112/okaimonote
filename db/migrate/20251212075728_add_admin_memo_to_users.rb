class AddAdminMemoToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :admin_memo, :text
  end
end
