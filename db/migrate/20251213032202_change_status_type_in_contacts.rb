class ChangeStatusTypeInContacts < ActiveRecord::Migration[8.0]
  def change
    change_column :contacts, :status, :integer, using: 'status::integer'
  end
end
