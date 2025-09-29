require 'rails_helper'

RSpec.describe Product, type: :model do
  describe 'バリデーション' do
    it '商品名があれば有効' do
      product = build(:product)
      expect(product).to be_valid
    end

    it '商品名が無ければ無効' do
      product = build(:product, name: nil)
      expect(product).not_to be_valid
    end
  end

  describe 'アソシエーション' do
    it { should belong_to(:user) }
    it { should belong_to(:category) }
    it { should belong_to(:price_records.dependent(:destroy)) }
  end
end
