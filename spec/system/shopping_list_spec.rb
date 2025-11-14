require 'rails_helper'

RSpec.describe "買い物リスト機能", type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:shopping_list) { user.shopping_list || create(:shopping_list, user: user) }
  let!(:item1) { create(:shopping_item, name: "牛乳", shopping_list: shopping_list, purchased: false, memo: "特売") }
  let!(:item2) { create(:shopping_item, name: "洗剤", shopping_list: shopping_list, purchased: true) }

  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path)

    find('p', text: 'カート').click
    expect(page).to have_current_path(shopping_list_path)
  end

  describe "一覧表示" do
    it "登録済みのアイテムが表示されること" do
      expect(page).to have_content "牛乳"
      expect(page).to have_content "洗剤"
    end

    it "購入済みアイテムは取り消し線付きで表示されること" do
      within("#purchased_items_list") do
        expect(page).to have_css(".line-through", text: "洗剤")
      end
    end
  end

  describe "新規追加" do
    it "アイテムを追加できること" do
      fill_in "shopping_item[name]", with: "トイレットペーパー"
      fill_in "shopping_item[memo]", with: "特売コーナー確認"
      click_button "追加"

      expect(page).to have_content "トイレットペーパー"
      expect(page).to have_content "特売コーナー確認"
    end

    it "商品名が空だと追加できないこと" do
      fill_in "shopping_item[name]", with: ""
      click_button "追加"

      expect(page).to have_content "商品を追加できませんでした"
    end
  end

  describe "購入済みトグル切り替え", js: true do
    it "未購入→購入済みに切り替わること" do
      within("#shopping_items") do
        find("li", text: "牛乳").find("i.fa-cart-arrow-down").click
      end

      expect(page).to have_css("#purchased_items_list .line-through", text: "牛乳")
    end

    it "購入済み→未購入に戻せること" do
      within("#purchased_items_list") do
        find("li", text: "洗剤").find("i.fa-rotate-left").click
      end

      expect(page).to have_css("#shopping_items li", text: "洗剤")
    end
  end

  describe "編集機能", js: true do
    let!(:item3) { create(:shopping_item, name: "卵", memo: "10個入り", shopping_list: shopping_list) }

    it "モーダルから商品を編集できること" do
      within("li", text: "卵") do
        find("a[href*='edit']").click
      end

      within("#modal_container") do
        fill_in "shopping_item[name]", with: "卵（Lサイズ）"
        fill_in "shopping_item[memo]", with: "セール中"
        click_button "更新する"
      end

      within("#shopping_items") do
        expect(page).to have_content "卵（Lサイズ）"
        expect(page).to have_content "セール中"
      end

      expect(page).not_to have_css("#modal")
    end
  end

  describe "購入済み削除", js: true do
    it "購入済みアイテムを削除できること" do
      within("#purchased_section") do
        find("button", text: "購入済みを削除").click
      end

      within("[data-confirm-target='modal']") do
        find("button", text: "削除").click
      end

      expect(page).to have_content "購入済みの商品を削除しました"
      expect(page).not_to have_content "洗剤"
    end
  end
end
