require "rails_helper"

RSpec.describe "ファミリー管理（管理者）", type: :system do
  let(:family) { create(:family) }
  let(:admin)  { create(:user, :family_admin, family: family) }

  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path)
    visit family_path
  end

  it "招待リンクが表示される" do
    expect(page).to have_content("招待リンク")
    expect(page).to have_selector("i.fa-copy")
  end

  it "QRコード表示ボタンが見える" do
    expect(page).to have_button("招待用QRコードを表示")
  end

  it "招待リンク再発行ボタンが見える" do
    expect(page).to have_button("招待リンクを再発行する")
  end

  it "ファミリー削除ボタンが見える" do
    expect(page).to have_button("ファミリーを削除する（管理者のみ）")
  end
end
