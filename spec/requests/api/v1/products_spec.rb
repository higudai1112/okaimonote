require "rails_helper"

RSpec.describe "Api::V1::Products", type: :request do
  describe "GET /api/v1/products" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:product) { create(:product, user: user) }

      before { sign_in(user, scope: :user) }

      it "200と商品一覧をJSONで返す" do
        get "/api/v1/products"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json).to be_an(Array)
        expect(json.first["id"]).to be_present
        expect(json.first["name"]).to eq(product.name)
      end

      it "他ユーザーの商品は含まれない" do
        other_user = create(:user)
        create(:product, user: other_user, name: "他人の商品")

        get "/api/v1/products"

        json = response.parsed_body
        names = json.map { |p| p["name"] }
        expect(names).not_to include("他人の商品")
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/products"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
