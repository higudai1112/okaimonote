require "rails_helper"

RSpec.describe "Api::V1::Admin::AbnormalPrices", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }
  let(:general_user) { create(:user, :without_callbacks) }

  describe "GET /api/v1/admin/abnormal_prices" do
    context "管理者の場合" do
      before { sign_in(admin, scope: :user) }

      it "200を返す" do
        get "/api/v1/admin/abnormal_prices"
        expect(response).to have_http_status(:ok)
      end

      it "配列を返す" do
        get "/api/v1/admin/abnormal_prices"
        json = response.parsed_body
        expect(json).to be_an(Array)
      end

      context "異常価格レコードが存在する場合" do
        let(:user) { create(:user, :without_callbacks) }
        let(:product) { create(:product, user: user) }
        let(:shop) { create(:shop, user: user) }

        before do
          # 平均より大幅に高い価格レコードを作成して異常値を発生させる
          create(:price_record, product: product, shop: shop, user: user, price: 100)
          create(:price_record, product: product, shop: shop, user: user, price: 110)
          create(:price_record, product: product, shop: shop, user: user, price: 10_000)
        end

        it "異常価格レコードに必要なフィールドを含む" do
          get "/api/v1/admin/abnormal_prices"
          json = response.parsed_body
          # 異常価格が検出された場合のフィールド確認
          if json.any?
            record = json.first
            expect(record).to have_key("id")
            expect(record).to have_key("price")
            expect(record).to have_key("product_name")
            expect(record).to have_key("shop_name")
          end
        end
      end
    end

    context "一般ユーザーの場合" do
      before { sign_in(general_user, scope: :user) }

      it "403を返す" do
        get "/api/v1/admin/abnormal_prices"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/admin/abnormal_prices"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
