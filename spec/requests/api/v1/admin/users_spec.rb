require "rails_helper"

RSpec.describe "Api::V1::Admin::Users", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }
  let(:target_user) { create(:user, :without_callbacks) }

  before { target_user }

  describe "GET /api/v1/admin/users" do
    before { sign_in(admin, scope: :user) }

    it "ユーザー一覧をJSONで返す" do
      get "/api/v1/admin/users"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["users"]).to be_an(Array)
      expect(json["meta"]).to have_key("total")
    end

    it "キーワードで検索できる" do
      get "/api/v1/admin/users", params: { q: target_user.email }
      json = JSON.parse(response.body)
      expect(json["users"].map { |u| u["email"] }).to include(target_user.email)
    end
  end

  describe "GET /api/v1/admin/users/:id" do
    before { sign_in(admin, scope: :user) }

    it "ユーザー詳細をJSONで返す" do
      get "/api/v1/admin/users/#{target_user.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(target_user.id)
      expect(json["email"]).to eq(target_user.email)
    end
  end

  describe "PATCH /api/v1/admin/users/:id" do
    before { sign_in(admin, scope: :user) }

    it "管理者メモを更新できる" do
      patch "/api/v1/admin/users/#{target_user.id}",
            params: { user: { admin_memo: "要観察" } }
      expect(response).to have_http_status(:ok)
      expect(target_user.reload.admin_memo).to eq("要観察")
    end
  end

  describe "PATCH /api/v1/admin/users/:id/ban" do
    before { sign_in(admin, scope: :user) }

    it "ユーザーをBANできる" do
      patch "/api/v1/admin/users/#{target_user.id}/ban",
            params: { reason: "規約違反" }
      expect(response).to have_http_status(:ok)
      expect(target_user.reload.status).to eq("banned")
    end
  end

  describe "PATCH /api/v1/admin/users/:id/unban" do
    before do
      target_user.update!(status: "banned", banned_reason: "規約違反")
      sign_in(admin, scope: :user)
    end

    it "BANを解除できる" do
      patch "/api/v1/admin/users/#{target_user.id}/unban"
      expect(response).to have_http_status(:ok)
      expect(target_user.reload.status).to eq("active")
    end
  end

  context "一般ユーザーでアクセス" do
    before { sign_in(target_user, scope: :user) }

    it "403を返す" do
      get "/api/v1/admin/users"
      expect(response).to have_http_status(:forbidden)
    end
  end
end
