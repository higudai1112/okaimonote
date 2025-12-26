require 'rails_helper'

RSpec.describe 'アカウント削除', type: :system do
  let!(:user) { create(:user) }

  before do
    # ログイン
    visit new_user_session_path
    fill_in "user[email]", with: user.email   # ← ラベルではなく name 属性
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path) # ログイン成功の確認
  end

  it '設定画面からアカウントを削除できる' do
    # 設定画面へ
    visit settings_path

    # 削除導線がある
    expect(page).to have_link 'アカウント削除'

    click_link 'アカウント削除'

    # 確認画面
    expect(page).to have_content 'アカウント削除'
    expect(page).to have_button '削除する'

    # 削除実行（confirm対応）
    accept_confirm do
      click_button '削除する'
    end

    # トップへリダイレクトされる
    expect(page).to have_current_path(root_path)

    # ログアウト状態になっている
    expect(page).to have_content 'ログイン'

    # DBから削除されている
    expect(User.exists?(user.id)).to be false
  end
end
