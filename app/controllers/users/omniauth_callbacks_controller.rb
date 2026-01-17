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

    unless @user.persisted?
      flash[:alert] = "#{kind}ログインに失敗しました。"
      return redirect_to new_user_session_path
    end

    sign_in @user
    @user.update_tracked_fields!(request)

    if ios_oauth?
      redirect_to ios_callback_url(@user)
    else
      flash[:notice] = I18n.t("devise.omniauth_callbacks.success", kind: kind)
      redirect_to home_path
    end
  end

  # ===== helpers =====

  # 「iOSからOAuthを開始したかどうか」だけを見る
  def ios_oauth?
    params[:ios] == "true"
  end

  def ios_callback_url(user)
    token = user.signed_id(
      purpose: :ios_login,
      expires_in: 10.minutes
    )
    "okaimonote://auth/callback?token=#{token}"
  end
end
