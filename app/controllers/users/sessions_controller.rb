class Users::SessionsController < Devise::SessionsController
  def create
    super do |user|
      flash[:notice] = "お帰りなさい、#{user.nickname}さん！"
    end
  end

  def guest_sign_in
    user = User.guest
    sign_in user
    redirect_to home_path, notice: "ゲストユーザーとしてログインしました。"
  end
end
