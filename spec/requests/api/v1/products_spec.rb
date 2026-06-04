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
        expect(json["data"]).to be_an(Array)
        expect(json["data"].first["id"]).to be_present
        expect(json["data"].first["name"]).to eq(product.name)
      end

      it "他ユーザーの商品は含まれない" do
        other_user = create(:user)
        create(:product, user: other_user, name: "他人の商品")

        get "/api/v1/products"

        json = response.parsed_body
        names = json["data"].map { |p| p["name"] }
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

  describe "GET /api/v1/products/:id" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:product) { create(:product, user: user) }
      let!(:price_record) { create(:price_record, product: product, user: user) }

      before { sign_in(user, scope: :user) }

      it "200と商品詳細・価格履歴をJSONで返す" do
        get "/api/v1/products/#{product.public_id}"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["product"]["id"]).to eq(product.id)
        expect(json["product"]["name"]).to eq(product.name)
        expect(json["price_records"]).to be_an(Array)
        expect(json["price_records"].first["price"]).to eq(price_record.price)
        expect(json["price_records"].first["public_id"]).to eq(price_record.public_id)
        expect(json["meta"]["total"]).to eq(1)
      end

      it "他ユーザーの商品は404を返す" do
        other_user = create(:user)
        other_product = create(:product, user: other_user)

        get "/api/v1/products/#{other_product.public_id}"

        expect(response).to have_http_status(:not_found)
      end
    end

    context "未認証の場合" do
      let(:user) { create(:user) }
      let!(:product) { create(:product, user: user) }

      it "401を返す" do
        get "/api/v1/products/#{product.public_id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/products/:id" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:product) { create(:product, user: user) }

      before { sign_in(user, scope: :user) }

      it "200と更新後の商品データを返す" do
        patch "/api/v1/products/#{product.public_id}",
              params: { product: { name: "更新後の商品名" } },
              as: :json

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["name"]).to eq("更新後の商品名")
        expect(product.reload.name).to eq("更新後の商品名")
      end

      it "バリデーションエラー時は422を返す" do
        patch "/api/v1/products/#{product.public_id}",
              params: { product: { name: "" } },
              as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json = response.parsed_body
        expect(json["errors"]).to be_present
      end

      it "他ユーザーの商品は404を返す" do
        other_user = create(:user)
        other_product = create(:product, user: other_user)

        patch "/api/v1/products/#{other_product.public_id}",
              params: { product: { name: "書き換え" } },
              as: :json

        expect(response).to have_http_status(:not_found)
      end
    end

    context "未認証の場合" do
      let(:user) { create(:user) }
      let!(:product) { create(:product, user: user) }

      it "401を返す" do
        patch "/api/v1/products/#{product.public_id}",
              params: { product: { name: "不正アクセス" } },
              as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
