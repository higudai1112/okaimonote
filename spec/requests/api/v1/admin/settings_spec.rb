require "rails_helper"

RSpec.describe "Api::V1::Admin::Settings", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }
  let(:general_user) { create(:user, :without_callbacks) }

  describe "GET /api/v1/admin/settings" do
    context "管理者の場合" do
      before { sign_in(admin, scope: :user) }

      it "200を返す" do
        get "/api/v1/admin/settings"
        expect(response).to have_http_status(:ok)
      end

      it "max_family_membersを返す" do
        get "/api/v1/admin/settings"
        json = response.parsed_body
        expect(json["max_family_members"]).to eq(Family::MAX_MEMBERS)
      end
    end

    context "一般ユーザーの場合" do
      before { sign_in(general_user, scope: :user) }

      it "403を返す" do
        get "/api/v1/admin/settings"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/admin/settings"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
