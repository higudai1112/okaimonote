class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    auth = request.env["omniauth.auth"]
    @user = User.from_omniauth(auth)

    if @user.persisted?
      flash[:notice] = I18n.t("devise.omniauth_callbacks.success", kind: "Google")
      sign_in_and_redirect @user, event: :authentication
    else
      flash[:alert] = "Googleログインに失敗しました。"
      redirect_to new_user_session_path
    end
  end

  def failure
    redirect_to new_user_session_path, alert: "Googleログインがキャンセルされました。"
  end
end
