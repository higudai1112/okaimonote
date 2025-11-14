require 'rails_helper'

RSpec.describe 'HOME画面', type: :system do
  let!(:user) { create(:user, :without_callbacks) }
  let!(:category) { create(:category, name: "食料品#{SecureRandom.hex(4)}", user: user) }
  let!(:shop) { create(:shop, name: "イオン", user: user) }
  let!(:product1) { create(:product, name: "牛乳", category: category, user: user) }
  let!(:product2) { create(:product, name: "お肉", category: category, user: user) }
  let!(:price_record1) { create(:price_record, product: product1, shop: shop, user: user, price: 150, purchased_at: Date.today - 3) }
  let!(:price_record2) { create(:price_record, product: product1, user: user, price: 200, purchased_at: Date.today - 2, memo: "特売") }
  let!(:price_record3) { create(:price_record, product: product2, shop: shop, user: user, price: 600, purchased_at: Date.today - 10, memo: "広告の品") }


  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path)
  end

  describe "検索機能" do
    before do
      click_button "絞り込み検索"

      expect(page).to have_selector("form", visible: true, wait: 2)
    end

    content "単一条件" do
      it "商品名で検索できること" do
        fill_in "商品名", with: "牛乳"
        click_button "検索"

        expect(page).to have_content("牛乳", wait: 2)
        expect(page).to have_content "200円"
        expect(page).to have_content "150円"
        expect(page).to have_content "イオン"
      end

      it "カテゴリーで検索できること" do
        select "食料品", from: "カテゴリー"
        click_button "検索"

        expect(page).to have_content("牛乳", wait: 2)
        expect(page).to have_content "200円"
        expect(page).to have_content "イオン"
        expect(page).to have_content "お肉"
        expect(page).to have_content "600円"
      end

      it "店舗で検索できること" do
        select "イオン", from: "店舗"
        click_button "検索"
        within(".price-records") do
          expect(page).to have_content("牛乳", wait: 2)
          expect(page).to have_content "150円"
          expect(page).to have_content "お肉"
          expect(page).not_to have_content "200円"
        end
      end
    end

    content "複合検索" do
      it "商品名 + カテゴリー + 店舗で検索できる" do
        fill_in "商品名", with: "牛乳"
        select "食料品", from: "カテゴリー"
        select "イオン", from: "店舗"
        click_button "検索"

        expect(page).to have_content("牛乳", wait: 2)
        expect(page).to have_content "150円"
        expect(page).to have_content "イオン"
        # 他条件に合わないデータは表示されないこと
        expect(page).not_to have_content "お肉"
      end
    end
  end

  describe "価格サマリー" do
    content "正常系" do
      it "平均・最安値・最高値が表示されること" do
        find_all(".card", text: "牛乳").first.click

        expect(page).to have_content "平均価格: 175円"
        expect(page).to have_content "最安値: 150円"
        expect(page).to have_content "最高値: 200円"
      end
    end
  end

  describe "価格登録履歴" do
    content "正常系" do
      it "新着順に表示されること" do
        within(".price-records") do
          expect(page).to have_content "600円"
          expect(page).to have_content "200円"
          expect(page).to have_content "150円"
        end
      end

      it "メモがあればアイコンが表示されること" do
        within(".price-records") do
          expect(page).to have_content("▶︎ メモを見る")
        end
      end
    end
  end
end
