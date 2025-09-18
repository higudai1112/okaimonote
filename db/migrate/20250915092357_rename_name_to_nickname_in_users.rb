class RenameNameToNicknameInUsers < ActiveRecord::Migration[8.0]
  def change
    rename_column :users, :name, :nickname
  end
end
