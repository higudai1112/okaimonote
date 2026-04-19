require "rails_helper"

RSpec.describe "Api::V1::Profile", type: :request do
  let(:user) { create(:user, nickname: "元の名前", prefecture: "東京都") }
  before { sign_in(user, scope: :user) }

  describe "PATCH /api/v1/profile" do
    it "200とユーザー情報を返す" do
      patch "/api/v1/profile", params: {
        user: { nickname: "新しい名前", prefecture: "大阪府" }
      }

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["nickname"]).to eq("新しい名前")
      expect(json["prefecture"]).to eq("大阪府")
    end

    it "nicknameが空の場合は422を返す" do
      patch "/api/v1/profile", params: { user: { nickname: "" } }
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "更新がDBに反映される" do
      patch "/api/v1/profile", params: { user: { nickname: "DB確認" } }
      expect(user.reload.nickname).to eq("DB確認")
    end
  end

  context "未認証の場合" do
    before { sign_out :user }
    it "401を返す" do
      patch "/api/v1/profile", params: { user: { nickname: "test" } }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
