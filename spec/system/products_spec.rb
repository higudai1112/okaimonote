require 'rails_helper'

RSpec.describe '商品管理', type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:category) { create(:category, name: "食料品#{SecureRandom.hex(4)}", user: user) }
  let!(:shop) { create(:shop, name: "イオン", user: user) }
  let!(:product1) { create(:product, name: "ひき肉", category: category, user: user) }
  let!(:product2) { create(:product, name: "お茶", category: category, user: user) }
  let!(:product3) { create(:product, name: "洗濯洗剤", user: user) }

   before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email   # ← ラベルではなく name 属性
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path) # ログイン成功の確認
    find('p', text: '登録リスト').click
    find('a', text: 'カテゴリーリスト').click
    expect(page).to have_current_path(categories_path)
  end

  describe "商品一覧" do
    it "すべての商品が表示されること" do
      click_link 'すべての商品'

      expect(page).to have_current_path(products_path)
      expect(page).to have_content "ひき肉"
      expect(page).to have_content "お茶"
      expect(page).to have_content "洗濯洗剤"
    end
    it "商品一覧が表示されていること" do
      click_link category.name

      expect(page).to have_current_path(category_products_path(category))
      expect(page).to have_content "ひき肉"
      expect(page).to have_content "お茶"
    end

    it "編集ページに遷移できること" do
      visit category_products_path(category)

      within("li", text: product1.name) do
        find("a i.fa-ellipsis-v").click
      end

      expect(page).to have_current_path(edit_product_path(product1))
      expect(page).to have_field "商品名", with: "ひき肉"
    end
  end

  describe '新規作成' do
    it '商品を新規登録する' do
      find('a[href="/products/new"] .fa-plus').click
      fill_in '商品名', with: '牛乳'
      select category.name, from: 'カテゴリー選択'
      fill_in 'メモ', with: '朝食用'
      click_button '登録する'

      expect(page).to have_content '商品を登録しました'
      expect(page).to have_content '牛乳'
    end
  end

  describe '商品を編集できる' do
    it '商品名を編集できる' do
      visit category_products_path(category)
      within("li", text: product1.name) do
        find("a i.fa-ellipsis-v").click
      end

      expect(page).to have_current_path(edit_product_path(product1))

      fill_in "商品名", with: "ミンチ肉"
      click_button "更新する"

      expect(page).to have_content "更新しました"
      expect(page).to have_content "ミンチ肉"
    end

    it "無効な入力でエラーが表示" do
      visit category_products_path(category)
      within("li", text: product1.name) do
        find("a i.fa-ellipsis-v").click
      end

      expect(page).to have_current_path(edit_product_path(product1))

      fill_in "商品名", with: ""
      click_button "更新する"

      expect(page).to have_content "エラーが発生しました"
    end
  end

  describe "削除機能" do
    it "商品を削除できること" do
      product = create(:product, name: "削除対象", user: user, category: category)
      visit products_path

      within(:xpath, "//li[contains(., '削除対象')]") do
        find("a i.fa-ellipsis-v").click
      end

      expect(page).to have_current_path(edit_product_path(product))

      accept_confirm do
        click_button "削除する"
      end

      expect(page).to have_current_path(category_products_path(product.category))
      expect(page).to have_content "削除しました"
      expect(page).not_to have_content "削除対象"
    end

    it "カテゴリーなしの商品を削除できること" do
    product = create(:product, name: "未所属削除", user: user, category: nil)
      visit products_path

      within(:xpath, "//li[contains(., '未所属削除')]") do
        find("a i.fa-ellipsis-v").click
      end

      expect(page).to have_current_path(edit_product_path(product))

      accept_confirm do
        click_button "削除する"
      end

      expect(page).to have_current_path(products_path)
      expect(page).to have_content "削除しました"
      expect(page).not_to have_content "未所属削除"
    end
  end

  describe "詳細表示" do
      # 商品と購入履歴を事前に作成
      let!(:price_record) { create(:price_record, product: product1, user: user, shop: shop, price: 198, purchased_at: Date.today, memo: "特売品") }
    it "商品名とメモ、購入履歴が表示されること" do
      visit products_path
      click_link "ひき肉"
      # 商品情報の表示
      expect(page).to have_content "ひき肉"         # 商品名
      expect(page).to have_content category.name
      expect(page).to have_content product1.memo

      # 購入履歴の表示（カード形式を想定）
      expect(page).to have_content "198円"
      expect(page).to have_content "イオン"
      expect(page).to have_content I18n.l(price_record.purchased_at, format: :default)
      expect(page).to have_css("i.fas.fa-sticky-note")
    end
  end
end
