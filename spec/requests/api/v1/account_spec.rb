require "rails_helper"

RSpec.describe "Api::V1::Account", type: :request do
  describe "DELETE /api/v1/account" do
    let(:user) { create(:user, :without_callbacks) }

    context "認証済みの場合" do
      before { sign_in(user, scope: :user) }

      it "200を返す" do
        delete "/api/v1/account"
        expect(response).to have_http_status(:ok)
      end

      it "メッセージを返す" do
        delete "/api/v1/account"
        json = response.parsed_body
        expect(json["message"]).to be_present
      end

      it "ユーザーがDBから削除される" do
        expect { delete "/api/v1/account" }.to change(User, :count).by(-1)
      end

      it "削除後は同じユーザーでAPIにアクセスできない" do
        delete "/api/v1/account"
        get "/api/v1/me"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        delete "/api/v1/account"
        expect(response).to have_http_status(:unauthorized)
      end

      it "ユーザーが削除されない" do
        user
        expect { delete "/api/v1/account" }.not_to change(User, :count)
      end
    end
  end
end
