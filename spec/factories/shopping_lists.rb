FactoryBot.define do
  factory :shopping_list do
    name { "買い物リスト" }
    association :user

    # user にすでに shopping_list が存在する場合はそれを再利用する
    initialize_with do
      user.shopping_list || new(attributes)
    end

    # 買い物リストに初期アイテムを追加したい場合
    trait :with_items do
      after(:create) do |shopping_list|
        create_list(:shopping_item, 3, shopping_list: shopping_list)
      end
    end
  end
end
