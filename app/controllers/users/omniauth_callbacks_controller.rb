class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    handle_auth("Google")
  end

  def line
    handle_auth("LINE")
  end

  def failure
    redirect_to new_user_session_path, alert: "ログインがキャンセルされました。"
  end

  private

  def handle_auth(kind)
    auth = request.env["omniauth.auth"]
    @user = User.from_omniauth(auth)

    if @user.persisted?
      @user.update_tracked_fields!(request) # ログイン履歴更新
      flash[:notice] = I18n.t("devise.omniauth_callbacks.success", kind: kind)
      sign_in_and_redirect @user, event: :authentication
    else
      flash[:alert] = "#{kind}ログインに失敗しました。"
      redirect_to new_user_session_path
    end
  end
end
