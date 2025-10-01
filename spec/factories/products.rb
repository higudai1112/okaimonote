FactoryBot.define do
  factory :product do
    name { "テスト商品" }
    memo { "メモ内容" }
    association :user
    association :category
  end
end
