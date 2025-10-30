class Users::RegistrationsController < Devise::RegistrationsController
  def create
    super do |user|
      flash.delete(:notice)
      flash[:notice] = "ようこそ、#{user.nickname}さん！<br>さっそく始めましょう！"
    end
  end
end
