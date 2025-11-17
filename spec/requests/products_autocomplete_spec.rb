require 'rails_helper'

RSpec.describe "商品のオートコンプリート", type: :request do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe "GET /products/autocomplete" do
    context "商品が無いとき" do
      it "0件で返ってくる" do
        get autocomplete_products_path, params: { q: "a" }

        expect(response).to have_http_status(:ok)
        expect(assigns(:suggestions)).to eq([])
      end
    end

    context "商品は1つだが、価格登録はなし" do
      let!(:product) { create(:product, user: user, name: "にんじん") }

      it "商品が候補に入ってくる" do
        get autocomplete_products_path, params: { q: "に" }

        expect(assigns(:suggestions)).to include(product)
      end
    end

    context "商品は5つで、価格登録はなし" do
      let!(:products) do
        [
          create(:product, user: user, name: "りんご"),
          create(:product, user: user, name: "みかん"),
          create(:product, user: user, name: "にんじん"),
          create(:product, user: user, name: "トマト"),
          create(:product, user: user, name: "たまご")
        ]
      end

      it "部分一致で返ってくる" do
        get autocomplete_products_path, params: { q: "に" }

        expect(assigns(:suggestions)).to include(products[2]) # にんじん
      end

      it "8件以内で返ってくる" do
        get autocomplete_products_path, params: { q: "" }

        expect(assigns(:suggestions).count).to be <= 8
      end
    end

    context "直近30日以内の価格記録が0件だが、過去には複数回購入した商品がある場合" do
      let!(:old_popular) do
        create(:product, user: user, name: "じゃがいも").tap do |p|
          create_list(:price_record, 5, product: p, created_at: 60.days.ago)
        end
      end

      let!(:recent_unused) do
        create(:product, user: user, name: "にんじん")
      end

      it "全期間の購入回数で集計された商品が優先的に候補に含まれること" do
        get autocomplete_products_path, params: { q: "" }

        suggestions = assigns(:suggestions)

        expect(suggestions.first).to eq(old_popular) # fallback 上位が先頭
      end
    end
  end
end
