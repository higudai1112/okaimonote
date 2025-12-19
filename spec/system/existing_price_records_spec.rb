require 'rails_helper'

RSpec.describe "価格登録（既存商品）", type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:category) { create(:category, user: user) }
  let!(:shop) { create(:shop, user: user) }
  let!(:product) { create(:product, user: user, category: category, name: "牛乳") }

  before do
    driven_by(:rack_test)

    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"
  end

  it "既存商品ID指定で価格を登録できる" do
    visit new_price_record_path(mode: "existing")

    fill_in "商品名", with: "牛乳"

    find("input[name='price_record[product_id]']", visible: false)
      .set(product.id)

    select shop.name, from: "店名"
    fill_in "価格", with: 200
    fill_in "日付", with: Date.today

    expect {
      click_button "登録する"
    }.to change { user.reload.price_records_count }.by(1)

    expect(page).to have_content "価格を登録しました"
  end
end
