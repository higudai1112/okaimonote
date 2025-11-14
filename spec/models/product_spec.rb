require 'rails_helper'

RSpec.describe Product, type: :model do
  describe 'バリデーション' do
    context "有効な場合" do
      it '商品名があれば有効' do
        expect(build.(:product)).to be_valid
      end
    end

    context "無効な場合" do
      it '商品名が無ければ無効' do
        product = build(:product, name: nil)
        product.validate
        expect(product.errors[:name]).to include("を入力してください")
      end
    end
  end

  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:category).optional }
    it { is_expected.to have_many(:price_records) }
  end
end
