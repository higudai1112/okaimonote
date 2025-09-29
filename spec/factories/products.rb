FactoryBot.define do
  factory :product do
    name { "テスト商品" }
    association :user
    association :category
  end
end