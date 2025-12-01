require "rails_helper"

RSpec.describe "ファミリー管理（メンバー）", type: :system do
  let(:family)  { create(:family) }
  let(:member)  { create(:user, :family_member, family: family) }

  before do
    visit new_user_session_path
    fill_in "user[email]", with: user.email
    fill_in "user[password]", with: user.password
    click_button "ログイン"
    expect(page).to have_current_path(home_path)
    visit family_path
  end

  it "招待リンクが表示されない" do
    expect(page).not_to have_content("招待リンク")
    expect(page).not_to have_selector("i.fa-copy")
  end

  it "QRコード表示ボタンが非表示" do
    expect(page).not_to have_button("招待用QRコードを表示")
  end

  it "招待リンク再発行が表示されない" do
    expect(page).not_to have_button("招待リンクを再発行する")
  end

  it "脱退ボタンは表示される" do
    expect(page).to have_button("ファミリーから脱退する")
  end
end
