FactoryBot.define do
  factory :category do
    sequence(:name) { |n| "カテゴリー#{n}" }
    memo { "メモ内容" }
    association :user
  end
end
