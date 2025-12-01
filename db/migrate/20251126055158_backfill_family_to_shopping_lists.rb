class BackfillFamilyToShoppingLists < ActiveRecord::Migration[8.0]
  class MigrationUser < ApplicationRecord
    self.table_name = "users"
  end

  class MigrationFamily < ApplicationRecord
    self.table_name = "families"
  end

  class MigrationShoppingList < ApplicationRecord
    self.table_name = "shopping_lists"
  end

  def up
    MigrationUser.find_each do |user|
      # ➤ invite_token を手動で作る必要がある（コールバックが動かないため）
      family = MigrationFamily.create!(
        name: "#{user.nickname}のファミリー",
        owner_id: user.id,
        invite_token: SecureRandom.urlsafe_base64(32)
      )

      list = MigrationShoppingList.find_by(user_id: user.id)
      list&.update!(family_id: family.id)
    end
  end
end
