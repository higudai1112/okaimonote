require 'rails_helper'

RSpec.describe Shop, type: :model do
  let(:shop) { build(:shop) }

  describe "バリデーション" do
    it "名前があれば有効であること" do
      expect(shop).to be_valid
    end

    it "名前がなければ無効であること" do
      shop.name = ""
      expect(shop).not_to be_valid
      expect(shop.errors[:name]).to include("を入力してください")
    end

    it "ユーザーが紐づいていなければ無効であること" do
      shop.user = nil
      expect(shop).not_to be_valid
      expect(shop.errors[:user]).to include("を入力してください")
    end
  end

  describe 'アソシエーション' do
    it { should belong_to(:user) }
    it { should have_many(:price_records) }
  end
end
