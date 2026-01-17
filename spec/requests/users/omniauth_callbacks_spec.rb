require 'rails_helper'

RSpec.describe "Users::OmniauthCallbacks", type: :request do
  describe "GET /users/auth/google_oauth2/callback" do
    let(:user) { FactoryBot.create(:user, email: "test@example.com") }

    before do
      mock_google_oauth(email: "test@example.com", name: "Test User")
    end

    context "when state param is 'ios'" do
      it "redirects to the iOS custom scheme url" do
        get user_google_oauth2_omniauth_callback_path, params: { state: "ios" }

        # We expect a redirect to okaimonote://auth/callback?token=...
        expect(response).to have_http_status(:found) # 302
        expect(response.location).to match(%r{^okaimonote://auth/callback\?token=})
      end
    end

    context "when state param is NOT 'ios'" do
      it "redirects to the home path (standard web flow)" do
        get user_google_oauth2_omniauth_callback_path

        expect(response).to redirect_to(home_path)
      end
    end
  end
end
