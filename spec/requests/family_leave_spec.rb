require "rails_helper"

RSpec.describe "Family Leave", type: :request do
  let(:family) { create(:family) }
  let(:member) { create(:user, :family_member, family: family) }
  let(:admin)  { create(:user, :family_admin, family: family) }

  it "メンバーは脱退できる" do
    sign_in member
    delete leave_family_path

    expect(member.reload.family).to be_nil
    expect(member.personal?).to be true
  end

  it "管理者は脱退できない" do
    sign_in admin
    delete leave_family_path

    expect(admin.reload.family).to eq(family)
  end
end
