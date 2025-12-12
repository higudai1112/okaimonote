class Admin::BaseController < ApplicationController
  before_action :authenticate_user!   # Devise の認証
  before_action :require_admin

  layout "admin"  # 後で作る admin 用レイアウトを指定

  private

  def require_admin
    unless current_user&.admin?
      redirect_to root_path, alert: "権限がありません"
    end
  end
end
