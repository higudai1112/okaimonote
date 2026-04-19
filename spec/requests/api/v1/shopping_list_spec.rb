require "rails_helper"

RSpec.describe "Api::V1::ShoppingList", type: :request do
  describe "GET /api/v1/shopping_list" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:shopping_list) { create(:shopping_list, user: user) }

      before { sign_in(user, scope: :user) }

      it "200とショッピングリスト情報をJSONで返す" do
        get "/api/v1/shopping_list"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["id"]).to be_present
        expect(json["name"]).to eq(shopping_list.name)
        expect(json["items"]).to be_an(Array)
      end

      it "アイテムがある場合はitemsに含まれる" do
        item = create(:shopping_item, shopping_list: shopping_list)

        get "/api/v1/shopping_list"

        json = response.parsed_body
        expect(json["items"].length).to eq(1)
        expect(json["items"].first["id"]).to eq(item.id)
        expect(json["items"].first["name"]).to eq(item.name)
        expect(json["items"].first["purchased"]).to eq(false)
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/shopping_list"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/shopping_list/items" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:shopping_list) { create(:shopping_list, user: user) }

      before { sign_in(user, scope: :user) }

      it "アイテムを追加して201を返す" do
        post "/api/v1/shopping_list/items", params: { shopping_item: { name: "牛乳", memo: "1L" } }

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json["name"]).to eq("牛乳")
        expect(json["memo"]).to eq("1L")
        expect(json["purchased"]).to eq(false)
      end

      it "名前がない場合は422を返す" do
        post "/api/v1/shopping_list/items", params: { shopping_item: { name: "" } }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /api/v1/shopping_list/items/:id" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:shopping_list) { create(:shopping_list, user: user) }
      let!(:item) { create(:shopping_item, shopping_list: shopping_list) }

      before { sign_in(user, scope: :user) }

      it "購入済みトグルを更新して200を返す" do
        patch "/api/v1/shopping_list/items/#{item.id}", params: { shopping_item: { purchased: true } }

        expect(response).to have_http_status(:ok)
        expect(item.reload.purchased).to eq(true)
      end
    end
  end

  describe "DELETE /api/v1/shopping_list/items/:id" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:shopping_list) { create(:shopping_list, user: user) }
      let!(:item) { create(:shopping_item, shopping_list: shopping_list) }

      before { sign_in(user, scope: :user) }

      it "アイテムを削除して204を返す" do
        delete "/api/v1/shopping_list/items/#{item.id}"

        expect(response).to have_http_status(:no_content)
        expect(ShoppingItem.find_by(id: item.id)).to be_nil
      end
    end
  end

  describe "DELETE /api/v1/shopping_list/items/purchased" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let!(:shopping_list) { create(:shopping_list, user: user) }
      let!(:purchased_item) { create(:shopping_item, :purchased, shopping_list: shopping_list) }
      let!(:unpurchased_item) { create(:shopping_item, shopping_list: shopping_list) }

      before { sign_in(user, scope: :user) }

      it "購入済みアイテムのみ削除して204を返す" do
        delete "/api/v1/shopping_list/items/purchased"

        expect(response).to have_http_status(:no_content)
        expect(ShoppingItem.find_by(id: purchased_item.id)).to be_nil
        expect(ShoppingItem.find_by(id: unpurchased_item.id)).to be_present
      end
    end
  end
end
