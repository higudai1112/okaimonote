# お問い合わせ送信 API
module Api
  module V1
    class ContactsController < BaseController
      skip_before_action :authenticate_user!
      skip_before_action :reject_banned_user_api

      # POST /api/v1/contacts
      # お問い合わせを保存してメール送信する
      def create
        @contact = Contact.new(
          nickname: params[:nickname],
          email: params[:email],
          body: params[:message],
          status: :unread
        )

        if @contact.save
          ContactMailer.contact_email(params[:nickname], params[:email], params[:message]).deliver_now
          ContactMailer.auto_reply(params[:nickname], params[:email], params[:message]).deliver_now
          render json: { message: "お問い合わせを受け付けました" }, status: :created
        else
          render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
