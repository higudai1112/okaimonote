require 'rails_helper'

RSpec.describe "カテゴリー機能", type: :system do
  let(:user) { create(:user) }

  before do
    visit new_user_session_path
    fill_in "メールアドレス", with: user.email
    fill_in "パスワード", with: user.password
    click_button "ログイン"
  end

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

  it "カテゴリーを編集できる" do
    category = create(:category, name: "旧名", user: user)
    visit edit_category_path(category)
    fill_in "カテゴリー名", with: "新しい名前"
    click_button "更新する"

    expect(page).to have_content "更新しました"
    expect(page).to have_content "新しい名前"
  end

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
