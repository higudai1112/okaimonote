require "rails_helper"

RSpec.describe "Api::V1::Home", type: :request do
  describe "GET /api/v1/home" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }

      before { sign_in(user, scope: :user) }

      it "200と最新5件の価格登録履歴をJSONで返す" do
        product = create(:product, user: user)
        shop = create(:shop, user: user)
        6.times { |i| create(:price_record, user: user, product: product, shop: shop, price: 100 + i) }

        get "/api/v1/home"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["price_records"].length).to eq(5)
      end

      it "price_recordsに必要なフィールドが含まれる" do
        product = create(:product, user: user, name: "牛乳")
        shop = create(:shop, user: user, name: "イオン")
        create(:price_record, user: user, product: product, shop: shop, price: 198)

        get "/api/v1/home"

        json = response.parsed_body
        record = json["price_records"].first
        expect(record["price"]).to eq(198)
        expect(record["product_name"]).to eq("牛乳")
        expect(record["shop_name"]).to eq("イオン")
        expect(record).to have_key("purchased_at")
        expect(record).to have_key("memo")
      end

      it "価格登録がない場合は空配列を返す" do
        get "/api/v1/home"

        json = response.parsed_body
        expect(json["price_records"]).to eq([])
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/home"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/home/summary/:product_id" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let(:product) { create(:product, user: user) }

      before { sign_in(user, scope: :user) }

      it "200と価格サマリーをJSONで返す" do
        create(:price_record, user: user, product: product, price: 100)
        create(:price_record, user: user, product: product, price: 200)
        create(:price_record, user: user, product: product, price: 150)

        get "/api/v1/home/summary/#{product.id}"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["min_price"]).to eq(100)
        expect(json["max_price"]).to eq(200)
        expect(json["average_price"]).to eq(150)
        expect(json["product_name"]).to eq(product.name)
      end

      it "存在しない商品IDは404を返す" do
        get "/api/v1/home/summary/999999"
        expect(response).to have_http_status(:not_found)
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/home/summary/1"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
