require 'rails_helper'

RSpec.describe "価格登録", type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:category) { create(:category, name: "食料品#{SecureRandom.hex(4)}", user: user) }
  let!(:shop1) { create(:shop, user: user, name: "スーパーA") }
  let!(:shop2) { create(:shop, user: user, name: "イオン") }
  let!(:product1) { create(:product, user: user, category: category, name: "牛乳") }
  let!(:product2) { create(:product, user: user, category: category, name: "お肉") }
  let!(:price_record1) { create(:price_record, product: product1, user: user, price: 200, purchased_at: Date.today - 2, memo: "特売") }
  let!(:price_record2) { create(:price_record, product: product2, user: user, price: 340, purchased_at: Date.today - 1, memo: "特売品") }

  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path)
  end

  describe "新規商品で価格登録" do
    it 'カテゴリーとお店を選択して登録できる' do
      visit new_price_record_path(mode: "new")

      fill_in "商品名", with: "ヨーグルト"
      select category.name, from: "カテゴリー"
      select shop2.name, from: "店名"
      fill_in "価格", with: 150
      fill_in "日付", with: Date.today
      fill_in "メモ", with: "広告の品"

      click_button "登録する"

      expect(page).to have_current_path(home_path, wait: 5)
      expect(page).to have_content "価格を登録しました"
    end

    it "価格が未入力では登録できない" do
      visit new_price_record_path(mode: "new")

      fill_in "商品名", with: "ヨーグルト"
      select category.name, from: "カテゴリー"
      select shop1.name, from: "店名"
      fill_in "価格", with: ""  # 未入力
      fill_in "日付", with: Date.today
      fill_in "メモ", with: "テスト"

      click_button "登録する"

      expect(page).to have_content "価格を入力してください"
    end
  end

  describe "既存商品で価格登録" do
    it "既存商品とお店を選択して登録する" do
      visit new_price_record_path(mode: "existing")

      select category.name, from: "category_filter"
      expect(page).to have_select("商品名", with_options: [ product1.name ], wait: 5)

      # 商品を選択
      select product1.name, from: "商品名"

      select shop1.name, from: "price_record[shop_id]"
      fill_in "価格", with: 200
      fill_in "日付", with: Date.today
      fill_in "メモ", with: "厳選特価"

      click_button "登録する"

      expect(page).to have_current_path(home_path, wait: 5)
      expect(page).to have_content "価格を登録しました"
    end
  end

  describe "価格履歴の編集・削除" do
    let!(:product3) { create(:product, user: user, category: category, name: "削除用") }
    let!(:price_record3) { create(:price_record, product: product3, user: user, price: 200, purchased_at: Date.today - 2, memo: "削除用") }

    it "履歴を編集できる" do
      visit products_path
      click_link "牛乳"

      expect(page).to have_current_path(product_path(product1))

      # 「牛乳」商品の最初の価格履歴をクリック
      first("a[href*='price_records']").click
      expect(page).to have_current_path(edit_product_price_record_path(product1, price_record1))

      fill_in "価格", with: 210
      fill_in "メモ", with: "超特価"
      click_button "更新する"

      expect(page).to have_content "更新しました"
      expect(page).to have_content "210"
      expect(page).to have_content "超特価"
    end

    it "履歴を削除できる" do
      visit products_path
      click_link "削除用"

      expect(page).to have_current_path(product_path(product3))

      first("a[href*='price_records']").click
      expect(page).to have_current_path(edit_product_price_record_path(product3, price_record3))

      accept_confirm do
        find("form[action='#{product_price_record_path(product3, price_record3)}'] button").click
      end

      expect(page).to have_content "削除しました"
      expect(page).to have_current_path(product_path(product3))
    end
  end
end
