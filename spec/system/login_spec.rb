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

        expect(page).to have_current_path(home_path)
        expect(page).to have_content "お帰りなさい、#{user.nickname}さん！"
      end

      it "Googleアカウントで既存ユーザーとしてログインできる" do
        mock_google_oauth(
          email: user.email,
          name:  user.nickname,
          image: "https://example.com/test_image.jpg"
        )

        visit new_user_session_path
        click_button "Googleでログイン"

        expect(page).to have_current_path(home_path)
        expect(page).to have_content "Googleアカウントでログインしました"
        expect(User.count).to eq(1) # 新規追加されない
      end

      it "LINEアカウントで既存ユーザーとしてログインできる" do
        mock_line_oauth(
          email: user.email,
          name:  user.nickname,
          image: "https://example.com/line_image.jpg"
        )

        visit new_user_session_path
        click_button "LINEでログイン"

        expect(page).to have_current_path(home_path)
        expect(page).to have_content "LINEアカウントでログインしました"
        expect(User.count).to eq(1) # 既存ユーザーが使われる
      end
    end

    context "異常系" do
      it "誤った情報ではログインできない" do
        visit new_user_session_path
        fill_in "メールアドレス", with: user.email
        fill_in "パスワード", with: "wrongpassword"
        click_button "ログイン"

        expect(page).to have_current_path(new_user_session_path)
        expect(page).to have_content "メールアドレスまたはパスワードが違います"
      end

      it "未入力ではログインできない" do
        visit new_user_session_path
        click_button "ログイン"

        expect(page).to have_content "メールアドレスまたはパスワードが違います"
      end
    end
  end
end
