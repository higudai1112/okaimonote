# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts " デモの召喚"

# --- デモユーザー作成 ---
demo_user1 = User.find_or_create_by!(email: "demo1@example.com") do |user|
  user.password = "okaimonote1"
  user.nickname = "デモ太郎"
end

demo_user2 = User.find_or_create_by!(email: "demo2@example.com") do |user|
  user.password = "okaimonote2"
  user.nickname = "デモ子"
end

[ demo_user1, demo_user2 ].each do |user|
  # --- 店舗 ---
  shops = [ "イオン", "業務スーパー", "成城石井", "ライフ" ]
  shops.each { |name| user.shops.find_or_create_by!(name: name) }

  # --- 商品例 ---
  items = {
    "にんじん" => 3,
    "牛乳" => 2,
    "鶏むね肉" => 4,
    "豆腐" => 3
  }

  items.each do |name, times|
    category = user.categories.sample # 初期カテゴリーの中からランダム
    product = user.products.find_or_create_by!(name: name, category: category)

    # --- 価格履歴 ---
    times.times do
      PriceRecord.create!(
        user: user,
        product: product,
        shop: user.shops.sample,
        price: rand(100..400),
        purchased_at: rand(1..30).days.ago,
        memo: [ "特売品", "いつもより高め", "広告の品", nil ].sample
      )
    end
  end

  # --- お買い物リスト ---
  shopping_list = user.shopping_list
  [ "玉ねぎ", "バナナ", "豚バラ" ].each do |item|
    shopping_list.shopping_items.find_or_create_by!(name: item)
  end
end

puts "デモの召喚の召喚に成功"
