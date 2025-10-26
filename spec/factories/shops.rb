FactoryBot.define do
  factory :shop do
    name { "イオン" }
    memo { "メモ内容" }
    association :user
  end
end
