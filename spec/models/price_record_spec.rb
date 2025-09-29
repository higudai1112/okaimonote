require 'rails_helper'

RSpec.describe PriceRecord, type: :model do
  it '有効なファクトリーであること' do
    expect(price_record).to be_valid
  end

  it '価格がないと無効' do
    price_record.price = nil
    expect(price_record).not_to be_valid
  end

  it '購入日が無いと無効' do
    price_record.purchased_at = nil
    expect(price_record).not_to be_valid
  end

  it '商品が無いと無効' do
    price_record.product = nil
    expect(price_record).not_to be_valid
  end
end
