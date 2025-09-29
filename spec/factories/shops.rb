FactoryBot.define do
  factory :shop do
    name { "イオン" }
    association :user
  end
end