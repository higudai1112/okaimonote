class SettingsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :terms, :privacy, :contact, :send_contact, :thank_you ]

  def show
    @family = current_user.family
    @members = @family&.users
  end

  def terms; end
  def privacy; end
  def contact; end

  def send_contact
    nickname = params[:nickname]
    email    = params[:email]
    message  = params[:message]

    ContactMailer.contact_email(nickname, email, message).deliver_now
    ContactMailer.auto_reply(nickname, email, message).deliver_now

    redirect_to thank_you_path, notice: "お問い合わせを送信しました。"
  end

  def thank_you; end
end
