FactoryBot.define do
  factory :family do
    sequence(:name) { |n| "ファミリー#{n}" }
    invite_token { SecureRandom.urlsafe_base64(32) }

    association :owner, factory: :user
    base_user { owner }
  end
end
