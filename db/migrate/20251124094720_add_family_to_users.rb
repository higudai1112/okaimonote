class AddFamilyToUsers < ActiveRecord::Migration[8.0]
  def change
    add_reference :users, :family, foreign_key: true
    add_column :users, :family_role, :integer, null: false, default: 0
  end
end
