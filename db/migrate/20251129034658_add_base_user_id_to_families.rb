class AddBaseUserIdToFamilies < ActiveRecord::Migration[8.0]
  def change
    add_column :families, :base_user_id, :integer
  end
end
