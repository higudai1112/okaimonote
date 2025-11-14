FactoryBot.define do
  factory :shopping_item do
    sequence(:name) { |n| "商品#{n}" }
    memo { "メモ内容" }
    purchased { false }

    association :shopping_list

    trait :purchased do
      purchased { true }
    end
  end
end
