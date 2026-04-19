require "rails_helper"

RSpec.describe "Api::V1::Admin::Families", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }
  let(:family_admin_user) { create(:user, :without_callbacks) }
  let(:member_user) { create(:user, :without_callbacks) }
  let(:family) do
    fam = create(:family, owner: family_admin_user)
    family_admin_user.update!(family: fam, family_role: :family_admin)
    member_user.update!(family: fam, family_role: :family_member)
    fam
  end

  before { family }

  describe "GET /api/v1/admin/families" do
    before { sign_in(admin, scope: :user) }

    it "ファミリー一覧をJSONで返す" do
      get "/api/v1/admin/families"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["families"]).to be_an(Array)
      expect(json["meta"]).to have_key("total")
    end
  end

  describe "GET /api/v1/admin/families/:id" do
    before { sign_in(admin, scope: :user) }

    it "ファミリー詳細とメンバー一覧をJSONで返す" do
      get "/api/v1/admin/families/#{family.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(family.id)
      expect(json["members"]).to be_an(Array)
      expect(json["members"].size).to eq(2)
    end
  end

  describe "PATCH /api/v1/admin/families/:id/change_admin" do
    before { sign_in(admin, scope: :user) }

    it "ファミリー管理者を変更できる" do
      patch "/api/v1/admin/families/#{family.id}/change_admin",
            params: { user_id: member_user.id }
      expect(response).to have_http_status(:ok)
      expect(member_user.reload.family_admin?).to be true
      expect(family_admin_user.reload.family_member?).to be true
    end
  end

  describe "DELETE /api/v1/admin/families/:id/members/:user_id" do
    before { sign_in(admin, scope: :user) }

    it "メンバーを除名できる" do
      delete "/api/v1/admin/families/#{family.id}/members/#{member_user.id}"
      expect(response).to have_http_status(:ok)
      expect(member_user.reload.family_id).to be_nil
    end
  end
end
