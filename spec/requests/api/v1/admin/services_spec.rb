require "rails_helper"

RSpec.describe "Api::V1::Admin::Services", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }

  describe "GET /api/v1/admin/services" do
    before { sign_in(admin, scope: :user) }

    it "サービス概要をJSONで返す" do
      get "/api/v1/admin/services"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to have_key("users_count")
      expect(json).to have_key("price_records_count")
      expect(json).to have_key("rails_version")
    end
  end
end
