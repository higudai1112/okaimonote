require 'rails_helper'

RSpec.describe "フッターの表示と機能", type: :system do
  let(:user) { create(:user) }

  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email   # ← ラベルではなく name 属性
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path) # ログイン成功の確認
  end

  it 'HOMEアイコンが表示されている' do
    expect(page).to have_css('i.fa.fa-home')
    expect(page).to have_content('HOME')
  end

  it '登録リストに遷移できる' do
    find('p', text: '登録リスト').click
    expect(current_path).to eq(lists_path)
  end

  it '選択中のリンクにtext-orange-500が付与されている' do
    expect(page).to have_css("a.footer-link.text-orange-500", text: "HOME")

    find('p', text: '設定').click
    expect(page).to have_current_path(settings_path)
    expect(page).to have_css("a.footer-link.text-orange-500", text: "設定")
  end
end
