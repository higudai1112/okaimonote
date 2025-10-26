require 'rails_helper'

RSpec.describe PriceRecord, type: :model do
  let(:user) { create(:user) }
  let(:category) { create(:category, user: user) }
  let(:shop) { create(:shop, user: user) }
  let(:product) { create(:product, user: user, category: category) }
  let(:price_record) { build(:price_record, user: user, product: product, shop: shop) }

  it "有効なファクトリーであること" do
    expect(price_record).to be_valid
  end

  it "価格がないと無効" do
    price_record.price = nil
    expect(price_record).not_to be_valid
  end

  it "購入日がないと無効" do
    price_record.purchased_at = nil
    expect(price_record).not_to be_valid
  end

  it "商品がないと無効" do
    price_record.product = nil
    expect(price_record).not_to be_valid
  end

  describe 'アソシエーション' do
    it { should belong_to(:user) }
    it { should belong_to(:product) }
    it { should belong_to(:shop).optional }
  end
end
