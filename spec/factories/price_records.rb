FactoryBot.define do
  factory :price_record do
    price { 198 }
    memo { "テスト用メモ" }
    purchased_at { Date.today }
    association :user
    association :product
    association :shop
  end
end