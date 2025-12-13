class CreateContacts < ActiveRecord::Migration[8.0]
  def change
    create_table :contacts do |t|
      t.string :nickname
      t.string :email
      t.text :body
      t.string :status
      t.text :admin_memo

      t.timestamps
    end
  end
end
