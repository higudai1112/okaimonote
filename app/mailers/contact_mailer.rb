class ContactMailer < ApplicationMailer
  # 管理者宛
  def contact_email(nickname, email, message)
    @nickname = nickname
    @user_email = email
    @message = message

    mail(
      to: "okaimonote.team@gmail.com",
      subject: "【okaimonote】お問い合わせをいただきました",
      reply_to: email
    ) do |format|
      format.html { render layout: "mailer" }
    end
  end

  # ユーザーに自動返信
  def auto_reply(nickname, email, message)
    @nickname = nickname
    @message = message

    mail(
      to: email,
      subject: "【okaimonote】お問い合わせありがとうどざいます",
      reply_to: "okaimonote.team@gmail.com"
    ) do |format|
      format.html { render layout: "mailer" }
    end
  end
end
