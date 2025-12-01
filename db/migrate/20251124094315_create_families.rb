class CreateFamilies < ActiveRecord::Migration[8.0]
  def change
    create_table :families do |t|
      t.string :name, null: false
      t.string :invite_token, null: false
      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :families, :invite_token, unique: true
  end
end
