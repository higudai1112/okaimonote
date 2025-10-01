require 'rails_helper'

RSpec.describe "カテゴリー機能", type: :system do
  let(:user) { create(:user) }
  let!(:category1) { create(:category, name: "野菜", user: user) }
  let!(:category2) { create(:category, name: "お肉", user: user, memo: "加工肉含む") }

  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email   # ← ラベルではなく name 属性
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path) # ログイン成功の確認
  end

  describe "カテゴリー一覧ページ" do
    it "カテゴリー一覧が表示されること" do
      visit categories_path
      expect(page).to have_content "野菜"
      expect(page).to have_content "お肉"
    end

    it "メモがあるお店にメモアイコンが表示されること" do
      visit shops_path

      within("li", text: "業務スーパー") do
        expect(page).to have_selector(".fa-sticky-note")
      end
    end
  end

  describe "新規作成" do
    it "カテゴリーを新規作成できる" do
      visit new_category_path
      fill_in "カテゴリー名", with: "日用品"
      fill_in "メモ", with: "洗剤・ティッシュなど"
      click_button "登録する"

      expect(page).to have_content "カテゴリーを登録しました"
      expect(page).to have_content "日用品"
    end

    it "カテゴリー名が未入力では登録できない" do
      visit new_category_path
      fill_in "カテゴリー名", with: ""
      click_button "登録する"

      expect(page).to have_content "カテゴリー名を入力してください"
    end
  end

  describe "編集" do
    it "カテゴリーを編集できる" do
      category = create(:category, name: "旧名", user: user)
      visit edit_category_path(category)
      fill_in "カテゴリー名", with: "新しい名前"
      click_button "更新する"

      expect(page).to have_content "更新しました"
      expect(page).to have_content "新しい名前"
    end
  end

  describe "削除" do
    it "カテゴリーを削除できる" do
      category = create(:category, name: "削除対象", user: user)
      visit edit_category_path(category)
      accept_confirm do
        click_button "削除する"
      end

      expect(page).to have_content "削除しました"
      expect(page).not_to have_content "削除対象"
    end
  end
end
