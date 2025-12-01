require "rails_helper"

RSpec.describe "FamilyInvites Join", type: :request do
  let(:family) { create(:family) }
  let(:user)   { create(:user, :personal) }

  before { sign_in user }

  it "personal ユーザーが join できる" do
    post join_family_invite_path(family.invite_token)
    expect(user.reload.family).to eq(family)
    expect(user.family_member?).to be true
  end

  it "family_member は join できない" do
    user.update(family: create(:family), family_role: :family_member)
    post join_family_invite_path(family.invite_token)
    expect(response).to redirect_to(settings_path)
  end

  it "family_admin は join できない" do
    user.update(family_role: :family_admin)
    post join_family_invite_path(family.invite_token)
    expect(response).to redirect_to(settings_path)
  end
end
