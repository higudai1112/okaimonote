require 'rails_helper'

RSpec.describe "価格登録", type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:category) { create(:category, name: "食料品", user: user) }
  let!(:shop1) { create(:shop, user: user, name: "スーパーA") }
  let!(:shop2) { create(:shop, user: user, name: "イオン") }
  let!(:existing_product) { create(:product, user: user, category: category, name: "牛乳") }

  before do
    driven_by(:rack_test)

    # ログイン
    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"

    expect(page).to have_current_path(home_path)
  end

  describe "新規商品登録" do
    it "新規商品を登録できる" do
      visit new_price_record_path(mode: "new")

      fill_in "商品名", with: "ヨーグルト"
      select category.name, from: "カテゴリー"
      select shop2.name, from: "店名"
      fill_in "価格", with: 150
      fill_in "日付", with: Date.today
      fill_in "メモ", with: "広告の品"

      click_button "登録する"

      expect(page).to have_current_path(home_path)
      expect(page).to have_content "価格を登録しました"
    end

    it "価格が未入力では登録できない" do
      visit new_price_record_path(mode: "new")

      fill_in "商品名", with: "ヨーググルト"
      select category.name, from: "カテゴリー"
      select shop2.name, from: "店名"
      fill_in "価格", with: ""
      fill_in "日付", with: Date.today
      fill_in "メモ", with: "テスト"

      click_button "登録する"

      # エラー表示
      expect(page).to have_content "価格を入力してください"
    end
  end

  describe "既存商品で登録" do
    it "オートコンプリートから既存商品を選択して登録できる" do
      visit new_price_record_path(mode: "existing")

      # 商品名をタイプ → 候補が出る
      fill_in "商品名", with: "牛"

      # autocomplete-item が出るまで待つ（Stimulus で描画される）
      expect(page).to have_selector(".autocomplete-item", text: "牛乳", wait: 5)

      # 「牛乳」をクリック
      find(".autocomplete-item", text: "牛乳").click

      # 店名
      select shop1.name, from: "店名"

      fill_in "価格", with: 200
      fill_in "日付", with: Date.today
      fill_in "メモ", with: "厳選特価"

      click_button "登録する"

      expect(page).to have_current_path(home_path)
      expect(page).to have_content "価格を登録しました"
    end
  end
end
