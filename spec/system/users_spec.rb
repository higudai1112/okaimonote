require 'rails_helper'

RSpec.describe 'ユーザー登録', type: :system do
  describe '新規登録' do
    context '正常系' do
      it '正しい情報で登録できること' do
        visit new_user_registration_path

        fill_in 'user[nickname]', with: 'テストユーザー'
        fill_in 'user[email]', with: 'test@example.com'
        fill_in 'user[password]', with: 'password123'
        fill_in 'user[password_confirmation]', with: 'password123'
        click_button '登録する'

        expect(page).to have_current_path(home_path) # ログイン後の遷移先
        expect(page).to have_content 'アカウントを登録しました' # Deviseのflashメッセージ
      end

      it "アイコンなしでも登録できること" do
        visit new_user_registration_path
        fill_in "user[nickname]", with: "テストユーザー"
        fill_in "user[email]", with: "user@example.com"
        fill_in "user[password]", with: "password"
        fill_in "user[password_confirmation]", with: "password"
        click_button "登録する"
        expect(page).to have_content "アカウントを登録しました。"
        expect(User.last.avatar.attached?).to be_falsey
      end

      it "アイコンをアップロードして登録できること" do
        visit new_user_registration_path
        fill_in "user[nickname]", with: "テストユーザー"
        fill_in "user[email]", with: "user2@example.com"
        fill_in "user[password]", with: "password"
        fill_in "user[password_confirmation]", with: "password"
        attach_file "user[avatar]", Rails.root.join("spec/fixtures/test.png"), make_visible: true
        click_button "登録する"
        expect(page).to have_content "アカウントを登録しました。"
        expect(User.last.avatar).to be_attached
      end

      it "Googleアカウントで新規登録できること" do
        mock_google_oauth(
          email: "google_user@example.com",
          name:  "Google太郎",
          image: "https://example.com/test_image.jpg"
        )

        visit new_user_registration_path
        click_button "Googleで登録"

        expect(page).to have_current_path(home_path)
        expect(page).to have_content "Googleアカウントでログインしました"

        user = User.find_by(email: "google_user@example.com")
        expect(user).not_to be_nil
        expect(user.nickname).to eq("Google太郎")
        expect(user.avatar).to be_attached
      end
    end

    context '異常系' do
      it '無効な情報では登録できないこと' do
        visit new_user_registration_path

        fill_in 'user[nickname]', with: ''
        fill_in 'user[email]', with: ''
        fill_in 'user[password]', with: 'short'
        fill_in 'user[password_confirmation]', with: 'diffpass'
        click_button '登録する'

        expect(page).to have_content 'エラーが発生しました' # 共通のエラーメッセージ
        expect(page).to have_content 'メールアドレスを入力してください'
        expect(page).to have_content 'パスワードは6文字以上で入力してください'
      end
    end
  end
end
