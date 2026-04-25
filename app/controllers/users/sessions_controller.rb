class Users::SessionsController < Devise::SessionsController
  def create
    super do |resource|
      resource.update_tracked_fields!(request) # ログイン履歴更新
      flash.delete(:notice)
      flash[:notice] = "お帰りなさい、#{resource.nickname}さん！".html_safe
    end
  end

  private

  # Turbo Stream リクエスト時は MissingTemplate が発生し、
  # フォールバックのクロスホストリダイレクトが UnsafeRedirectError を引き起こすため、
  # 認証済みの場合は allow_other_host: true で明示的にリダイレクトする
  def respond_with(resource, opts = {})
    if warden.authenticated?(resource_name)
      redirect_to opts[:location] || after_sign_in_path_for(resource), allow_other_host: true
    else
      super
    end
  end
end
