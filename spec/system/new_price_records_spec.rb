require 'rails_helper'

RSpec.describe "価格登録", type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:category) { create(:category, name: "食料品", user: user) }
  let!(:shop) { create(:shop, user: user, name: "スーパーA") }

  before do
    driven_by(:rack_test)

    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"

    expect(page).to have_current_path(home_path)
  end

  describe "新規商品登録" do
    it "新規商品と価格を同時に登録できる" do
      visit new_price_record_path(mode: "new")

      fill_in "商品名", with: "ヨーグルト"
      select category.name, from: "カテゴリー"
      select shop.name, from: "店名"
      fill_in "価格", with: 150
      fill_in "日付", with: Date.today

      expect {
        click_button "登録する"
      }.to change { user.reload.products_count }.by(1)
       .and change { user.reload.price_records_count }.by(1)

      expect(page).to have_current_path(home_path)
      expect(page).to have_content "価格を登録しました"
    end

    it "価格が未入力では登録できない" do
      visit new_price_record_path(mode: "new")

      fill_in "商品名", with: "バター"
      select category.name, from: "カテゴリー"
      select shop.name, from: "店名"
      fill_in "価格", with: ""
      fill_in "日付", with: Date.today

      click_button "登録する"

      expect(page).to have_content "価格を入力してください"
    end
  end
end
