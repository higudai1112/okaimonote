require "rails_helper"

RSpec.describe "Api::V1::Contacts", type: :request do
  describe "POST /api/v1/contacts" do
    let(:valid_params) do
      {
        nickname: "テスト太郎",
        email: "test@example.com",
        message: "テストのお問い合わせ内容です"
      }
    end

    context "正常な入力の場合" do
      before do
        allow(ContactMailer).to receive_message_chain(:contact_email, :deliver_now)
        allow(ContactMailer).to receive_message_chain(:auto_reply, :deliver_now)
      end

      it "201を返す" do
        post "/api/v1/contacts", params: valid_params
        expect(response).to have_http_status(:created)
      end

      it "メッセージを返す" do
        post "/api/v1/contacts", params: valid_params
        json = response.parsed_body
        expect(json["message"]).to be_present
      end

      it "お問い合わせがDBに保存される" do
        expect {
          post "/api/v1/contacts", params: valid_params
        }.to change(Contact, :count).by(1)
      end

      it "管理者宛メールと自動返信メールが送信される" do
        mailer_double = double("mailer", deliver_now: true)
        allow(ContactMailer).to receive(:contact_email).and_return(mailer_double)
        allow(ContactMailer).to receive(:auto_reply).and_return(mailer_double)

        post "/api/v1/contacts", params: valid_params

        expect(ContactMailer).to have_received(:contact_email)
        expect(ContactMailer).to have_received(:auto_reply)
      end
    end

    context "必須項目が空の場合" do
      before do
        allow(ContactMailer).to receive_message_chain(:contact_email, :deliver_now)
        allow(ContactMailer).to receive_message_chain(:auto_reply, :deliver_now)
      end

      it "nicknameが空の場合は422を返す" do
        post "/api/v1/contacts", params: valid_params.merge(nickname: "")
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "emailが空の場合は422を返す" do
        post "/api/v1/contacts", params: valid_params.merge(email: "")
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "messageが空の場合は422を返す" do
        post "/api/v1/contacts", params: valid_params.merge(message: "")
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "422の場合はerrorsキーを含む" do
        post "/api/v1/contacts", params: valid_params.merge(nickname: "")
        json = response.parsed_body
        expect(json["errors"]).to be_present
      end
    end

    context "未認証でもアクセスできること" do
      before do
        allow(ContactMailer).to receive_message_chain(:contact_email, :deliver_now)
        allow(ContactMailer).to receive_message_chain(:auto_reply, :deliver_now)
      end

      it "認証なしで201を返す" do
        post "/api/v1/contacts", params: valid_params
        expect(response).to have_http_status(:created)
      end
    end
  end
end
