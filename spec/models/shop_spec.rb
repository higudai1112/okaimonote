require 'rails_helper'

RSpec.describe Shop, type: :model do
  let(:shop) { build(:shop) }

  describe "バリデーション" do
    context "有効な場合" do
      it "名前があれば有効であること" do
        expect(shop).to be_valid
      end
    end

    context "無効な場合" do
      it "名前がなければ無効であること" do
        shop.name =nil
        shop.validate
        expect(shop.errors[:name]).to include("を入力してください")
      end

      it "ユーザーが紐づいていなければ無効であること" do
        shop.user = nil
        shop.validate
        expect(shop.errors[:user]).to include("を入力してください")
      end
    end
  end

  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:price_records) }
  end
end
