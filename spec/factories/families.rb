FactoryBot.define do
  factory :family do
    sequence(:name) { |n| "ファミリー#{n}" }
    invite_token { SecureRandom.hex(10) }

    # owner と base_user は作成後に紐付ける（User側で設定するため）
    after(:create) do |family|
      # owner や base_user を自動で設定したい場合はここに書ける
      # ただし User factory の方で紐づけるため、ここでは何もしない
    end
  end
end
