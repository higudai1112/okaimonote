require "rails_helper"

RSpec.describe "Family Transfer Owner", type: :request do
  let(:family)      { create(:family) }
  let(:admin)       { create(:user, :family_admin, family: family) }
  let(:new_owner)   { create(:user, :family_member, family: family) }

  before { sign_in admin }

  it "権限譲渡が成功し、owner と role が切り替わる" do
    post transfer_owner_family_path(member_id: new_owner.id)

    expect(family.reload.owner).to eq(new_owner)
    expect(new_owner.reload.family_admin?).to be true
    expect(admin.reload.family_member?).to be true
  end

  it "自分自身へは譲渡不可" do
    post transfer_owner_family_path(member_id: admin.id)
    expect(response).to redirect_to(family_path)
  end
end
