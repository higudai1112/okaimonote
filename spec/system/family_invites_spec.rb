require "rails_helper"

RSpec.describe "ファミリー招待", type: :system do
  let!(:admin) do
    create(:user, :family_admin, :without_callbacks)
  end

  let!(:family) do
    create(:family, owner: admin, base_user: admin)
  end

  let!(:member1) do
    create(:user, :family_member, :without_callbacks, family: family)
  end

  let!(:member2) do
    create(:user, :family_member, :without_callbacks, family: family)
  end

  let!(:guest) do
    create(:user, :personal, :without_callbacks)
  end

  before do
    admin.update!(family: family)

    visit new_user_session_path
    fill_in "user[email]", with: guest.email
    fill_in "user[password]", with: guest.password
    click_button "ログイン"

    expect(page).to have_current_path(home_path)
  end

  it "上限に達しているファミリーには参加できない" do
    visit family_invite_path(family.invite_token)

    expect(page).to have_content "上限（3人）に達しています"
    expect(page).to have_button "メンバーになる", disabled: true
  end
end
