require "rails_helper"

RSpec.describe "Api::V1::Categories", type: :request do
  let(:user) { create(:user) }
  before { sign_in(user, scope: :user) }

  describe "GET /api/v1/categories" do
    it "200とカテゴリー一覧を返す" do
      create(:category, user: user, name: "野菜")
      get "/api/v1/categories"
      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      names = json.map { |c| c["name"] }
      expect(names).to include("野菜")
    end

    it "他ユーザーのカテゴリーは含まれない" do
      other = create(:user)
      create(:category, user: other, name: "他人のカテゴリー")
      get "/api/v1/categories"
      json = response.parsed_body
      expect(json.map { |c| c["name"] }).not_to include("他人のカテゴリー")
    end
  end

  describe "POST /api/v1/categories" do
    it "201とカテゴリーを返す" do
      post "/api/v1/categories", params: { category: { name: "肉類", memo: "メモ" } }
      expect(response).to have_http_status(:created)
      expect(response.parsed_body["name"]).to eq("肉類")
    end

    it "nameが空の場合は422を返す" do
      post "/api/v1/categories", params: { category: { name: "" } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/categories/:id" do
    it "200とカテゴリーを返す" do
      cat = create(:category, user: user, name: "元の名前")
      patch "/api/v1/categories/#{cat.id}", params: { category: { name: "新しい名前" } }
      expect(response).to have_http_status(:ok)
      expect(cat.reload.name).to eq("新しい名前")
    end
  end

  describe "DELETE /api/v1/categories/:id" do
    it "204を返す" do
      cat = create(:category, user: user)
      delete "/api/v1/categories/#{cat.id}"
      expect(response).to have_http_status(:no_content)
      expect(Category.find_by(id: cat.id)).to be_nil
    end
  end

  context "未認証の場合" do
    before { sign_out :user }
    it "401を返す" do
      get "/api/v1/categories"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
