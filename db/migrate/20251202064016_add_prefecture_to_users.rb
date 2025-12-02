class AddPrefectureToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :prefecture, :string
  end
end
