require 'rails_helper'

RSpec.describe "IosAuth", type: :request do
  describe "GET /ios/session" do
    let(:user) { FactoryBot.create(:user) }

    context "有効なトークンの場合" do
      let(:token) { user.signed_id(purpose: :ios_login, expires_in: 5.minutes) }

      it "ホーム画面にリダイレクトする" do
        get "/ios/session", params: { token: token }
        expect(response).to redirect_to(home_path)
      end

      it "remember_me Cookie が発行される（アプリ終了後もログイン維持）" do
        get "/ios/session", params: { token: token }
        expect(response.cookies["remember_user_token"]).to be_present
      end
    end

    context "BANされたユーザーの場合" do
      let(:banned_user) { FactoryBot.create(:user, status: "banned") }
      let(:token) { banned_user.signed_id(purpose: :ios_login, expires_in: 5.minutes) }

      it "ログイン画面にリダイレクトする" do
        get "/ios/session", params: { token: token }
        expect(response).to redirect_to(new_user_session_path)
      end

      it "remember_me Cookie が発行されない" do
        get "/ios/session", params: { token: token }
        expect(response.cookies["remember_user_token"]).to be_nil
      end
    end

    context "無効なトークンの場合" do
      it "ログイン画面にリダイレクトする" do
        get "/ios/session", params: { token: "invalid" }
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "期限切れトークンの場合" do
      it "ログイン画面にリダイレクトする" do
        token = user.signed_id(purpose: :ios_login, expires_in: -1.minute)
        get "/ios/session", params: { token: token }
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end
