require 'rails_helper'

RSpec.describe PriceRecord, type: :model do
  let(:user) { create(:user) }
  let(:category) { create(:category, user: user) }
  let(:shop) { create(:shop, user: user) }
  let(:product) { create(:product, user: user, category: category) }
  let(:price_record) { build(:price_record, user: user, product: product, shop: shop) }

  describe "バリデーション" do
    context "有効な場合" do
      it "有効なファクトリーであること" do
        expect(price_record).to be_valid
      end
    end

    context "無効な場合" do
      it "価格がないと無効" do
        price_record.price = nil
        price_record.validate
        expect(price_record.errors[:price]).to include("を入力してください")
      end

      it "購入日がないと無効" do
        price_record.purchased_at = nil
        price_record.validate
        expect(price_record.errors[:purchased_at]).to include("を入力してください")
      end

      it "商品がないと無効" do
        price_record.product = nil
        price_record.validate
        expect(price_record.errors[:product]).to include("を入力してください")
      end
    end
  end

  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:product) }
    it { is_expected.to belong_to(:shop).optional }
  end
end
