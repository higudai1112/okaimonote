require "rails_helper"

RSpec.describe "Api::V1::Admin::Contacts", type: :request do
  let(:admin) { create(:user, :without_callbacks, :admin) }
  let(:contact) { create(:contact) }

  before { contact }

  describe "GET /api/v1/admin/contacts" do
    before { sign_in(admin, scope: :user) }

    it "お問い合わせ一覧をJSONで返す" do
      get "/api/v1/admin/contacts"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["contacts"]).to be_an(Array)
      expect(json["meta"]).to have_key("total")
    end
  end

  describe "GET /api/v1/admin/contacts/:id" do
    before { sign_in(admin, scope: :user) }

    it "お問い合わせ詳細をJSONで返す" do
      get "/api/v1/admin/contacts/#{contact.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(contact.id)
      expect(json["status"]).to eq("unread")
    end
  end

  describe "PATCH /api/v1/admin/contacts/:id" do
    before { sign_in(admin, scope: :user) }

    it "ステータスとメモを更新できる" do
      patch "/api/v1/admin/contacts/#{contact.id}",
            params: { contact: { status: "resolved", admin_memo: "対応済み" } }
      expect(response).to have_http_status(:ok)
      expect(contact.reload.status).to eq("resolved")
    end
  end
end
