FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
    password_confirmation { "password" }
    nickname { "テストユーザー" }

    # カテゴリー初期化のコールバックを無効化
    trait :without_callbacks do
      after(:build) do |_|
        User.skip_callback(:create, :after, :setup_default_categories)
      end

      after(:create) do |_|
        User.set_callback(:create, :after, :setup_default_categories)
      end
    end

    # personal（初期状態）
    trait :personal do
      family { nil }
      family_role { :personal }
    end

    # family_member（家族に所属）
    trait :family_member do
      family_role { :family_member }
    end

    # family_admin（管理者）
    trait :family_admin do
      family_role { :family_admin }
    end
  end
end
