require "rails_helper"

RSpec.describe "Api::V1::FamilyInvites", type: :request do
  let(:admin_user) { create(:user, :without_callbacks) }
  let(:personal_user) { create(:user, :without_callbacks, :personal) }
  let(:family) do
    fam = create(:family, owner: admin_user)
    admin_user.update!(family: fam, family_role: :family_admin)
    fam
  end

  before { family }

  describe "GET /api/v1/family_invites/:token" do
    it "有効なトークンでファミリー情報を返す" do
      get "/api/v1/family_invites/#{family.invite_token}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq(family.name)
      expect(json["members_count"]).to eq(family.users.count)
    end

    it "無効なトークンで404を返す" do
      get "/api/v1/family_invites/invalid_token"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/family_invites/:token/join" do
    context "personalユーザーでログイン中" do
      before { sign_in(personal_user, scope: :user) }

      it "ファミリーに参加できる" do
        post "/api/v1/family_invites/#{family.invite_token}/join"
        expect(response).to have_http_status(:ok)
        expect(personal_user.reload.family_member?).to be true
        expect(personal_user.reload.family).to eq(family)
      end
    end

    context "すでに別ファミリーに所属している場合（管理者）" do
      before { sign_in(admin_user, scope: :user) }

      it "422を返す" do
        post "/api/v1/family_invites/#{family.invite_token}/join"
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "上限（3名）に達している場合" do
      before do
        # admin + 2名追加して上限に
        2.times do
          u = create(:user, :without_callbacks)
          u.update!(family: family, family_role: :family_member)
        end
        sign_in(personal_user, scope: :user)
      end

      it "422を返す" do
        post "/api/v1/family_invites/#{family.invite_token}/join"
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "未認証" do
      it "401を返す" do
        post "/api/v1/family_invites/#{family.invite_token}/join"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "無効なトークン" do
      before { sign_in(personal_user, scope: :user) }

      it "404を返す" do
        post "/api/v1/family_invites/invalid_token/join"
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /api/v1/family_invites/apply_code" do
    context "ログイン中" do
      before { sign_in(personal_user, scope: :user) }

      it "有効なコードでトークンを返す" do
        post "/api/v1/family_invites/apply_code",
             params: { invite_token: family.invite_token }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["invite_token"]).to eq(family.invite_token)
      end

      it "URL形式でも末尾トークンを抽出してOK" do
        post "/api/v1/family_invites/apply_code",
             params: { invite_token: "https://example.com/family_invites/#{family.invite_token}" }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["invite_token"]).to eq(family.invite_token)
      end

      it "無効なコードで404を返す" do
        post "/api/v1/family_invites/apply_code",
             params: { invite_token: "invalid_code" }
        expect(response).to have_http_status(:not_found)
      end

      it "空のコードで422を返す" do
        post "/api/v1/family_invites/apply_code", params: { invite_token: "" }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "未認証" do
      it "401を返す" do
        post "/api/v1/family_invites/apply_code",
             params: { invite_token: family.invite_token }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
