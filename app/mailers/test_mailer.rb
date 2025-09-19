class TestMailer < ApplicationMailer
  def sample_email(user)
    @user = user
    mail(
      to: @user.email,
      subject: "【テスト送信】おかいもノートからのメール",
    )
  end
end
