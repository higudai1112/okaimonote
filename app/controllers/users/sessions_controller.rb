class Users::SessionsController < Devise::SessionsController
  def create
    super do |resource|
      flash.delete(:notice)
      flash[:notice] = "お帰りなさい、#{resource.nickname}さん！".html_safe
    end
  end
end
