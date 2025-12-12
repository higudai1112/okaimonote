class Users::SessionsController < Devise::SessionsController
  def create
    super do |resource|
      resource.update_tracked_fields!(request) # ログイン履歴更新
      flash.delete(:notice)
      flash[:notice] = "お帰りなさい、#{resource.nickname}さん！".html_safe
    end
  end
end
