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

    @contact = Contact.new(
      nickname: nickname,
      email: email,
      body: message,
      status: :unread
    )

    if @contact.save
      # 管理者へ通知
      ContactMailer.contact_email(nickname, email, message).deliver_now
      # 自動返信
      ContactMailer.auto_reply(nickname, email, message).deliver_now

      redirect_to thank_you_path, notice: "お問い合わせを送信しました。"
    else
      flash.now[:alert] = "送信に失敗しました。入力内容をご確認ください。"
      render :contact, status: :unprocessable_entity
    end
  end

  def thank_you; end
end
