require "rails_helper"

RSpec.describe "Api::V1::Sessions", type: :request do
  let(:user) { create(:user, :without_callbacks, password: "password123") }

  describe "POST /api/v1/sessions" do
    context "正しい認証情報の場合" do
      it "200を返しユーザー情報を含むJSONを返す" do
        post "/api/v1/sessions", params: { email: user.email, password: "password123" }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(user.id)
        expect(json["email"]).to eq(user.email)
      end
    end

    context "remember_me が '1' の場合" do
      it "remember_me Cookie が発行される（アプリ終了後もログイン維持）" do
        post "/api/v1/sessions", params: { email: user.email, password: "password123", remember_me: "1" }
        expect(response).to have_http_status(:ok)
        expect(response.cookies["remember_user_token"]).to be_present
      end
    end

    context "remember_me が '0' の場合" do
      it "remember_me Cookie が発行されない" do
        post "/api/v1/sessions", params: { email: user.email, password: "password123", remember_me: "0" }
        expect(response).to have_http_status(:ok)
        expect(response.cookies["remember_user_token"]).to be_nil
      end
    end

    context "パスワードが間違っている場合" do
      it "401を返す" do
        post "/api/v1/sessions", params: { email: user.email, password: "wrong" }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "存在しないメールアドレスの場合" do
      it "401を返す" do
        post "/api/v1/sessions", params: { email: "notfound@example.com", password: "password123" }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/sessions" do
    before { sign_in(user, scope: :user) }

    it "200を返しログアウトメッセージを返す" do
      delete "/api/v1/sessions"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["message"]).to be_present
    end
  end
end
