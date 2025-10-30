class Users::SessionsController < Devise::SessionsController
  def create
    super
      flash.delete(:notice)
      flash[:notice] = "お帰りなさい、#{current_user.nickname}さん！"
  end
end
