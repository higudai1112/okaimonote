class SettingsController < ApplicationController
  def show
    render :logged_in
  end

  def terms; end

  def privacy; end

  def contact; end

  def send_contact
    nickname = params[:nickname]
    email = params[:email]
    message = params[:message]

    # 管理者宛
    ContactMailer.contact_email(nickname, email, message).deliver_now

    # ユーザー宛自動返信
    ContactMailer.auto_reply(nickname, email, message).deliver_now

    redirect_to thank_you_path, notice: "お問い合わせを送信しました。"
  end
end
