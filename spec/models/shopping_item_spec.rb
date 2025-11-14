require 'rails_helper'

RSpec.describe ShoppingItem, type: :model do
  let(:user) { create(:user, :without_callbacks) }
  let(:shopping_list) { create(:shopping_list, user: user) }

  describe "バリデーション" do
    it "名前とshopping_listがあれば有効であること" do
      item = build(:shopping_item, name: "牛乳", shopping_list: shopping_list)
      expect(item).to be_valid
    end

    it "名前がなければ無効であること" do
      item = build(:shopping_item, name: nil, shopping_list: shopping_list)
      item.validate
      expect(item.errors[:name]).to include("を入力してください")
    end
  end

  describe "アソシエーション" do
    it { is_expected.to belong_to(:shopping_list) }
  end

  describe "購入状態" do
    it "初期状態では未購入（false）であること" do
      item = build(:shopping_item, shopping_list: shopping_list)
      expect(item.purchased).to be_falsey
    end

    it "購入済み（true）にもできること" do
      item = build(:shopping_item, :purchased, shopping_list: shopping_list)
      expect(item.purchased).to be_truthy
    end
  end
end
