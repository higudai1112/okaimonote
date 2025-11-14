require 'rails_helper'

RSpec.describe "ログイン機能", type: :system do
  let(:user) { create(:user) }

  describe "ログイン" do
    context "正常系" do
      it "正しい情報でログインできる" do
        visit new_user_session_path
        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: user.password
        click_button "ログイン"

        expect(page).to have_current_path(home_path) # ログイン後に遷移するパス
        expect(page).to have_content "お帰りなさい、#{user.nickname}さん！"   # フラッシュメッセージがあれば
      end
    end

    context "異常系" do
      it "誤った情報ではログインできない" do
        visit new_user_session_path
        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: "wrongpassword"
        click_button "ログイン"

        expect(page).to have_current_path(new_user_session_path)
        expect(page).to have_content "メールアドレスまたはパスワードが違います" # Deviseのエラーメッセージ
      end

      it "未入力ではログインできない" do
        visit new_user_session_path
        click_button "ログイン"

        expect(page).to have_content "メールアドレスまたはパスワードが違います"
      end
    end
  end
end
