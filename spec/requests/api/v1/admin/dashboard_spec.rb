require "rails_helper"

RSpec.describe "Api::V1::Admin::Dashboard", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }
  let(:general) { create(:user, :without_callbacks) }

  describe "GET /api/v1/admin/dashboard" do
    context "管理者でログイン中" do
      before { sign_in(admin, scope: :user) }

      it "ダッシュボード統計をJSONで返す" do
        get "/api/v1/admin/dashboard"
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json).to have_key("new_users_today")
        expect(json).to have_key("active_users")
        expect(json).to have_key("total_families")
        expect(json).to have_key("unresolved_contacts")
        expect(json).to have_key("top_products")
        expect(json).to have_key("top_shops")
      end
    end

    context "一般ユーザーでログイン中" do
      before { sign_in(general, scope: :user) }

      it "403を返す" do
        get "/api/v1/admin/dashboard"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "未認証" do
      it "401を返す" do
        get "/api/v1/admin/dashboard"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
