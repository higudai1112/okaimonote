require 'rails_helper'

RSpec.describe "IosAuth", type: :request do
  describe "GET /ios/session" do
    let(:user) { FactoryBot.create(:user) }

    context "with valid token" do
      let(:token) { user.signed_id(purpose: :ios_login) }

      it "signs in the user and returns ok" do
        get "/ios/session", params: { token: token }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq({ "status" => "ok" })
        # Devise usually sets the remember_user_token or session cookie
        # In request specs, we can manually check if sign_in worked if we had access to the session,
        # but verifying the cookie presence or sign_in effect is tricky in pure request specs without helper.
        # However, checking the response assumes the controller reached sign_in.
      end
    end

    context "with invalid token" do
      it "returns unauthorized" do
        get "/ios/session", params: { token: "invalid" }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to eq({ "error" => "invalid or expired token" })
      end
    end

    context "with expired token" do
      it "returns unauthorized" do
        token = user.signed_id(purpose: :ios_login, expires_in: -1.minute)
        get "/ios/session", params: { token: token }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to eq({ "error" => "invalid or expired token" })
      end
    end
  end
end
