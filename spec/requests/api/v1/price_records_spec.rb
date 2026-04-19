require "rails_helper"

RSpec.describe "Api::V1::PriceRecords", type: :request do
  let(:user) { create(:user) }

  before { sign_in(user, scope: :user) }

  describe "GET /api/v1/price_records/form_data" do
    it "200とフォーム用データ（shops・categories・products）を返す" do
      create(:shop, user: user, name: "イオン")
      create(:category, user: user, name: "野菜")

      get "/api/v1/price_records/form_data"

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["shops"].map { |s| s["name"] }).to include("イオン")
      expect(json["categories"].map { |c| c["name"] }).to include("野菜")
      expect(json).to have_key("products")
    end
  end

  describe "POST /api/v1/price_records" do
    context "既存商品IDを指定した場合" do
      it "201と登録された価格記録を返す" do
        product = create(:product, user: user)
        shop = create(:shop, user: user)

        post "/api/v1/price_records", params: {
          price_record: {
            product_id: product.id,
            shop_id: shop.id,
            price: 198,
            purchased_at: "2024-01-15",
            memo: "特売"
          }
        }

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json["price"]).to eq(198)
        expect(json["product_name"]).to eq(product.name)
      end
    end

    context "新規商品名+カテゴリーを指定した場合" do
      it "201と価格記録を返し、商品も新規作成される" do
        category = create(:category, user: user)
        shop = create(:shop, user: user)

        post "/api/v1/price_records", params: {
          price_record: {
            product_name: "新しい商品",
            category_id: category.id,
            shop_id: shop.id,
            price: 298,
            purchased_at: "2024-01-15"
          }
        }

        expect(response).to have_http_status(:created)
        expect(Product.find_by(name: "新しい商品")).to be_present
      end
    end

    context "price が空の場合" do
      it "422を返す" do
        product = create(:product, user: user)

        post "/api/v1/price_records", params: {
          price_record: {
            product_id: product.id,
            price: nil,
            purchased_at: "2024-01-15"
          }
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /api/v1/price_records/:id" do
    it "200と更新された価格記録を返す" do
      product = create(:product, user: user)
      record = create(:price_record, user: user, product: product, price: 100)

      patch "/api/v1/price_records/#{record.public_id}", params: {
        price_record: { price: 150, memo: "更新メモ" }
      }

      expect(response).to have_http_status(:ok)
      expect(record.reload.price).to eq(150)
    end

    it "他ユーザーの価格記録は更新できない" do
      other_user = create(:user)
      product = create(:product, user: other_user)
      record = create(:price_record, user: other_user, product: product)

      patch "/api/v1/price_records/#{record.public_id}", params: {
        price_record: { price: 999 }
      }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/price_records/:id" do
    it "204を返し価格記録が削除される" do
      product = create(:product, user: user)
      record = create(:price_record, user: user, product: product)

      delete "/api/v1/price_records/#{record.public_id}"

      expect(response).to have_http_status(:no_content)
      expect(PriceRecord.find_by(id: record.id)).to be_nil
    end
  end

  describe "未認証の場合" do
    before { sign_out :user }

    it "401を返す" do
      get "/api/v1/price_records/form_data"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
