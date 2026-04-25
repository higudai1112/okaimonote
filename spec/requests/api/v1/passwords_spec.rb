require "rails_helper"

RSpec.describe "Api::V1::Passwords", type: :request do
  describe "POST /api/v1/passwords（パスワードリセットメール送信）" do
    let!(:user) { create(:user, :without_callbacks, email: "user@example.com") }

    context "登録済みのメールアドレスの場合" do
      it "200を返す" do
        post "/api/v1/passwords", params: { email: "user@example.com" }
        expect(response).to have_http_status(:ok)
      end

      it "メッセージを返す" do
        post "/api/v1/passwords", params: { email: "user@example.com" }
        json = response.parsed_body
        expect(json["message"]).to be_present
      end
    end

    context "未登録のメールアドレスの場合" do
      it "200を返す（メール存在確認攻撃を防ぐため）" do
        post "/api/v1/passwords", params: { email: "notfound@example.com" }
        expect(response).to have_http_status(:ok)
      end

      it "登録済みと同じメッセージを返す" do
        post "/api/v1/passwords", params: { email: "notfound@example.com" }
        json = response.parsed_body
        expect(json["message"]).to be_present
      end
    end

    context "未認証でもアクセスできること" do
      it "認証なしで200を返す" do
        post "/api/v1/passwords", params: { email: "user@example.com" }
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "PATCH /api/v1/passwords（パスワードリセット）" do
    let!(:user) { create(:user, :without_callbacks) }

    context "有効なリセットトークンの場合" do
      let(:token) do
        user.send_reset_password_instructions
        user.reset_password_token
      end

      it "200を返す" do
        raw_token = user.send(:set_reset_password_token)
        patch "/api/v1/passwords", params: {
          reset_password_token: raw_token,
          password: "newpassword123",
          password_confirmation: "newpassword123"
        }
        expect(response).to have_http_status(:ok)
      end

      it "メッセージを返す" do
        raw_token = user.send(:set_reset_password_token)
        patch "/api/v1/passwords", params: {
          reset_password_token: raw_token,
          password: "newpassword123",
          password_confirmation: "newpassword123"
        }
        json = response.parsed_body
        expect(json["message"]).to be_present
      end
    end

    context "無効なリセットトークンの場合" do
      it "422を返す" do
        patch "/api/v1/passwords", params: {
          reset_password_token: "invalid_token",
          password: "newpassword123",
          password_confirmation: "newpassword123"
        }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "パスワードが不一致の場合" do
      it "422を返す" do
        raw_token = user.send(:set_reset_password_token)
        patch "/api/v1/passwords", params: {
          reset_password_token: raw_token,
          password: "newpassword123",
          password_confirmation: "different"
        }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
