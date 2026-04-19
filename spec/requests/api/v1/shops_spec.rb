require "rails_helper"

RSpec.describe "Api::V1::Shops", type: :request do
  let(:user) { create(:user) }
  before { sign_in(user, scope: :user) }

  describe "GET /api/v1/shops" do
    it "200と店舗一覧を返す" do
      create(:shop, user: user, name: "イオン")
      get "/api/v1/shops"
      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.map { |s| s["name"] }).to include("イオン")
    end
  end

  describe "POST /api/v1/shops" do
    it "201と店舗を返す" do
      post "/api/v1/shops", params: { shop: { name: "西友", memo: "" } }
      expect(response).to have_http_status(:created)
      expect(response.parsed_body["name"]).to eq("西友")
    end

    it "nameが空の場合は422を返す" do
      post "/api/v1/shops", params: { shop: { name: "" } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/shops/:id" do
    it "200と店舗を返す" do
      shop = create(:shop, user: user, name: "旧名")
      patch "/api/v1/shops/#{shop.id}", params: { shop: { name: "新名" } }
      expect(response).to have_http_status(:ok)
      expect(shop.reload.name).to eq("新名")
    end
  end

  describe "DELETE /api/v1/shops/:id" do
    it "204を返す" do
      shop = create(:shop, user: user)
      delete "/api/v1/shops/#{shop.id}"
      expect(response).to have_http_status(:no_content)
      expect(Shop.find_by(id: shop.id)).to be_nil
    end
  end

  context "未認証の場合" do
    before { sign_out :user }
    it "401を返す" do
      get "/api/v1/shops"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
