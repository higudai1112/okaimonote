FactoryBot.define do
  factory :contact do
    sequence(:nickname) { |n| "問い合わせユーザー#{n}" }
    sequence(:email) { |n| "contact#{n}@example.com" }
    body { "テストのお問い合わせ内容です" }
    status { :unread }
  end
end
