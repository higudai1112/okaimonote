FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
    password_confirmation { "password" }
    nickname { "テストユーザー" }

    trait :without_callbacks do
      after(:build) do |user|
        User.skip_callback(:create, :after, :setup_default_categories)
      end

      after(:create) do |user|
        User.set_callback(:create, :after, :setup_default_categories)
      end
    end
  end
end
