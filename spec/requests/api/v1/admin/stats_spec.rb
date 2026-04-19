require "rails_helper"

RSpec.describe "Api::V1::Admin::Stats", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }

  before { sign_in(admin, scope: :user) }

  describe "GET /api/v1/admin/stats" do
    it "統計情報をJSONで返す" do
      get "/api/v1/admin/stats"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to have_key("count")
      expect(json).to have_key("top_products_by_records")
      expect(json).to have_key("top_shops")
    end

    it "キーワード検索ができる" do
      get "/api/v1/admin/stats", params: { keyword: "牛乳" }
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /api/v1/admin/stats/autocomplete_products" do
    it "商品名候補をJSONで返す" do
      get "/api/v1/admin/stats/autocomplete_products", params: { q: "牛" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to be_an(Array)
    end
  end

  describe "GET /api/v1/admin/stats/autocomplete_shops" do
    it "店舗名候補をJSONで返す" do
      get "/api/v1/admin/stats/autocomplete_shops", params: { q: "スーパー" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to be_an(Array)
    end
  end
end
