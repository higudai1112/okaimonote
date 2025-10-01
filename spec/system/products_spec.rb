require 'rails_helper'

RSpec.describe '商品管理', type: :system do
  let!(:user) { create(:user) }
  let!(:category) { create(:category, user: user) }
  let!(:product) { create(:product, user: user, category: category) }

   before do
    visit new_user_session_path
    fill_in "メールアドレス", with: user.email
    fill_in "パスワード", with: user.password
    click_button "ログイン"
  end

  it '商品を新規登録する' do
    visit new_product_path
    fill_in '商品名', with: '牛乳'
    select category.name, from: 'カテゴリー選択'
    fill_in 'メモ', with: '朝食用'
    click_button '登録する'

    expect(page).to have_content '登録しました'
    expect(page).to have_content '牛乳'
  end

  describe "商品一覧" do
    let(:user)     { create(:user) }
    let(:category) { create(:category, user: user, name: "飲料") }
    let!(:product1) { create(:product, name: "牛乳", category: category, user: user) }
    let!(:product2) { create(:product, name: "お茶", category: category, user: user) }

    before do
      sign_in user
    end

    it "商品一覧が表示されていること" do
      visit category_path(category)

      expect(page).to have_content "牛乳"
      expect(page).to have_content "お茶"
    end

    it "編集ページに遷移できること" do
      visit category_path(category)

      within all("li").first do
        find("a", text: "︙").click
      end

      expect(page).to have_current_path(edit_product_path(product1))
      expect(page).to have_field "商品名", with: "牛乳"
    end
  end

  describe '商品を編集できる' do
    let!(:user) { create(:user) }
    let!(:category) { create(:category, name: "日用品", user: user) }
    let!(:product) { create(:product, name: "トイレットペーパー", user: user, category: category) }

    before do
      sign_in user
    end

    it '商品名を編集できる' do
      visit edit_product_path(product)

      expect(page).to have_field "商品名", with: "トイレットペーパー"
      fill_in "商品名", with: "ティッシュペーパー"
      click_button "更新する"

      expect(current_path).to eq products_path
      expect(page).to have_content "更新しました"
    end

    it "無効な入力でエラーが表示" do
      visit edit_product_path(product)

      fill_in "商品名", with: ""
      click_button "更新する"

      expect(page).to have_content "エラーが発生しました"
      expect(page).to have_selector "div#error_explanation"
    end
  end

  describe "商品管理" do
    let!(:user) { create(:user) }
    let!(:category) { create(:category, user: user) }
    let!(:product) { create(:product, name: "牛乳", user: user, category: category) }

    before do
      sign_in user
    end
  end

  describe "削除機能" do
    it "商品を削除できること" do
      visit edit_product_path(product)

      accept_confirm "本当に削除しますか？" do
        click_button "削除する"
      end

      expect(current_path).to eq products_path
      expect(page).to have_content "削除しました"
      expect(page).not_to have_content "牛乳"
    end
  end

  describe "詳細表示" do
    it "商品名とメモ、購入履歴が表示されること" do
      # 商品と購入履歴を事前に作成
      shop = create(:shop, user: user, name: "スーパーA")
      price_record = create(:price_record, product: product, user: user, shop: shop, price: 198, memo: "特売品", purchased_at: Date.today)

      visit product_path(product)

      # 商品情報の表示
      expect(page).to have_content "牛乳"         # 商品名
      expect(page).to have_selector ".fa-sticky-note"  # メモアイコン（ある場合）
      expect(page).to have_content product.memo if product.memo.present?

      # 購入履歴の表示（カード形式を想定）
      expect(page).to have_content "198円"
      expect(page).to have_content "スーパーA"
      expect(page).to have_content I18n.l(price_record.purchased_at, format: :long)
      expect(page).to have_content "特売品"
    end
  end
end
