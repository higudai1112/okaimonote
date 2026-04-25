require "rails_helper"

RSpec.describe "Api::V1::Registrations", type: :request do
  describe "POST /api/v1/registrations" do
    let(:valid_params) do
      {
        nickname: "テストユーザー",
        email: "new@example.com",
        password: "password123",
        password_confirmation: "password123"
      }
    end

    context "正常な入力の場合" do
      it "201を返す" do
        post "/api/v1/registrations", params: valid_params
        expect(response).to have_http_status(:created)
      end

      it "メッセージを返す" do
        post "/api/v1/registrations", params: valid_params
        json = response.parsed_body
        expect(json["message"]).to be_present
      end

      it "ユーザーがDBに作成される" do
        expect {
          post "/api/v1/registrations", params: valid_params
        }.to change(User, :count).by(1)
      end
    end

    context "メールアドレスが空の場合" do
      it "422を返す" do
        post "/api/v1/registrations", params: valid_params.merge(email: "")
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "errorsキーを含むJSONを返す" do
        post "/api/v1/registrations", params: valid_params.merge(email: "")
        json = response.parsed_body
        expect(json["errors"]).to be_present
      end
    end

    context "パスワードが不一致の場合" do
      it "422を返す" do
        post "/api/v1/registrations", params: valid_params.merge(password_confirmation: "wrong")
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "すでに登録済みのメールアドレスの場合" do
      before { create(:user, :without_callbacks, email: "new@example.com") }

      it "422を返す" do
        post "/api/v1/registrations", params: valid_params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "未認証でもアクセスできること" do
      it "認証なしで201を返す" do
        post "/api/v1/registrations", params: valid_params
        expect(response).to have_http_status(:created)
      end
    end
  end
end
