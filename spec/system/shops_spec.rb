require 'rails_helper'

RSpec.describe "店舗機能", type: :system do
  let(:user) { create(:user) }
  let!(:shop1) { create(:shop, name: "イオン", user: user) }
  let!(:shop2) { create(:shop, name: "業務スーパー", user: user, memo: "A店") }

   before do
    visit new_user_session_path
    fill_in "メールアドレス", with: user.email
    fill_in "パスワード", with: user.password
    click_button "ログイン"
  end

  describe "お店一覧ページ" do
    it "お店一覧が表示されること" do
      visit shops_path
      expect(page).to have_content "イオン"
      expect(page).to have_content "業務スーパー"
    end

    it "メモがあるお店にメモアイコンが表示されること" do
      visit shops_path

      within("li", text: "業務スーパー") do
        expect(page).to have_selector(".fa-sticky-note")
      end
    end

    it "編集ページへ遷移できること" do
      visit shops_path

      within("li", text: "イオン") do
        find("a", text: "︙").click
      end

      expect(page).to have_current_path(edit_shop_path(shop1))
      expect(page).to have_field "店名", with: "イオン"
    end
  end

  describe "新規登録" do
    it "正しい情報でお店を登録できること" do
      visit new_shop_path

      fill_in "店名", with: "コープ"
      fill_in "メモ", with: "近所のスーパー"
      click_button "登録する"

      expect(page).to have_content "登録しました"
      expect(page).to have_content "コープ"
    end

    it "店名が空だとエラーになること" do
      visit new_shop_path

      fill_in "店名", with: ""
      click_button "登録する"

      expect(page).to have_content "店名を入力してください"
    end
  end

  describe "編集" do
    it "お店の情報を更新できること" do
      visit edit_shop_path(shop1)

      fill_in "店名", with: "イオンモール"
      fill_in "メモ", with: "ショッピングモール内"
      click_button "更新する"

      expect(page).to have_content "更新しました"
      expect(page).to have_content "イオンモール"
    end

    it "空欄では更新できないこと" do
      visit edit_shop_path(shop1)

      fill_in "店名", with: ""
      click_button "更新する"

      expect(page).to have_content "店名を入力してください"
    end
  end

  describe "削除" do
    it "お店を削除できること" do
      visit edit_shop_path(shop2)

      accept_confirm do
        click_button "削除する"
      end

      expect(page).to have_content "削除しました"
      expect(page).not_to have_content "業務スーパー"
    end
  end
end
