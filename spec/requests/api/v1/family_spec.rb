require "rails_helper"

RSpec.describe "Api::V1::Family", type: :request do
  let(:admin_user) { create(:user, :without_callbacks) }
  let(:member_user) { create(:user, :without_callbacks) }
  let(:other_user)  { create(:user, :without_callbacks) }
  let(:family) do
    fam = create(:family, owner: admin_user)
    admin_user.update!(family: fam, family_role: :family_admin)
    fam
  end

  before { family }

  describe "GET /api/v1/family" do
    context "管理者でログイン中" do
      before { sign_in(admin_user, scope: :user) }

      it "ファミリー情報とメンバー一覧をJSONで返す" do
        get "/api/v1/family"
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(family.id)
        expect(json["name"]).to eq(family.name)
        expect(json["invite_token"]).to eq(family.invite_token)
        expect(json["members"]).to be_an(Array)
        expect(json["members"].first["id"]).to eq(admin_user.id)
        expect(json["members"].first["family_role"]).to eq("family_admin")
      end
    end

    context "personalユーザーでログイン中" do
      let(:personal) { create(:user, :without_callbacks, :personal) }
      before { sign_in(personal, scope: :user) }

      it "404を返す" do
        get "/api/v1/family"
        expect(response).to have_http_status(:not_found)
      end
    end

    context "未認証" do
      it "401を返す" do
        get "/api/v1/family"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/family" do
    context "personalユーザーでログイン中" do
      let(:personal) { create(:user, :without_callbacks, :personal) }
      before { sign_in(personal, scope: :user) }

      it "ファミリーを作成して管理者になる" do
        expect {
          post "/api/v1/family", params: { family: { name: "テストファミリー" } }
        }.to change(Family, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("テストファミリー")
        expect(personal.reload.family_admin?).to be true
      end
    end

    context "すでにファミリーに所属している場合" do
      before { sign_in(admin_user, scope: :user) }

      it "422を返す" do
        post "/api/v1/family", params: { family: { name: "別ファミリー" } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "未認証" do
      it "401を返す" do
        post "/api/v1/family", params: { family: { name: "テスト" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/family" do
    context "管理者でログイン中" do
      before { sign_in(admin_user, scope: :user) }

      it "ファミリー名を更新できる" do
        patch "/api/v1/family", params: { family: { name: "新しい名前" } }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["name"]).to eq("新しい名前")
        expect(family.reload.name).to eq("新しい名前")
      end
    end

    context "一般メンバーでログイン中" do
      before do
        member_user.update!(family: family, family_role: :family_member)
        sign_in(member_user, scope: :user)
      end

      it "403を返す" do
        patch "/api/v1/family", params: { family: { name: "変更試み" } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE /api/v1/family" do
    context "管理者でログイン中" do
      before { sign_in(admin_user, scope: :user) }

      it "ファミリーを解散して全員personalに戻る" do
        expect {
          delete "/api/v1/family"
        }.to change(Family, :count).by(-1)
        expect(response).to have_http_status(:ok)
        expect(admin_user.reload.personal?).to be true
      end
    end

    context "一般メンバーでログイン中" do
      before do
        member_user.update!(family: family, family_role: :family_member)
        sign_in(member_user, scope: :user)
      end

      it "403を返す" do
        delete "/api/v1/family"
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE /api/v1/family/leave" do
    context "一般メンバーでログイン中" do
      before do
        member_user.update!(family: family, family_role: :family_member)
        sign_in(member_user, scope: :user)
      end

      it "ファミリーから脱退してpersonalになる" do
        delete "/api/v1/family/leave"
        expect(response).to have_http_status(:ok)
        expect(member_user.reload.personal?).to be true
      end
    end

    context "管理者でログイン中" do
      before { sign_in(admin_user, scope: :user) }

      it "422を返す（権限譲渡が先に必要）" do
        delete "/api/v1/family/leave"
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /api/v1/family/transfer_owner" do
    before do
      member_user.update!(family: family, family_role: :family_member)
    end

    context "管理者でログイン中" do
      before { sign_in(admin_user, scope: :user) }

      it "別メンバーに管理者権限を譲渡できる" do
        patch "/api/v1/family/transfer_owner", params: { member_id: member_user.id }
        expect(response).to have_http_status(:ok)
        expect(member_user.reload.family_admin?).to be true
        expect(admin_user.reload.family_member?).to be true
        expect(family.reload.owner).to eq(member_user)
      end

      it "存在しないメンバーIDには404を返す" do
        patch "/api/v1/family/transfer_owner", params: { member_id: 999999 }
        expect(response).to have_http_status(:not_found)
      end
    end

    context "一般メンバーでログイン中" do
      before { sign_in(member_user, scope: :user) }

      it "403を返す" do
        patch "/api/v1/family/transfer_owner", params: { member_id: admin_user.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "POST /api/v1/family/regenerate_invite" do
    context "管理者でログイン中" do
      before { sign_in(admin_user, scope: :user) }

      it "招待トークンを再発行できる" do
        old_token = family.invite_token
        post "/api/v1/family/regenerate_invite"
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["invite_token"]).not_to eq(old_token)
      end
    end

    context "一般メンバーでログイン中" do
      before do
        member_user.update!(family: family, family_role: :family_member)
        sign_in(member_user, scope: :user)
      end

      it "403を返す" do
        post "/api/v1/family/regenerate_invite"
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
