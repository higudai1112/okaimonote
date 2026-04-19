require "rails_helper"

RSpec.describe "Api::V1::Auth", type: :request do
  describe "GET /api/v1/me" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }

      before { sign_in(user, scope: :user) }

      it "200とユーザー情報をJSONで返す" do
        get "/api/v1/me"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["id"]).to eq(user.id)
        expect(json["email"]).to eq(user.email)
        expect(json["nickname"]).to eq(user.nickname)
        expect(json["role"]).to eq(user.role)
        expect(json["family_role"]).to eq(user.family_role)
      end

      it "パスワードやトークンなど機密情報を含まない" do
        get "/api/v1/me"

        json = response.parsed_body
        expect(json.keys).not_to include("encrypted_password", "reset_password_token")
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get "/api/v1/me"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
