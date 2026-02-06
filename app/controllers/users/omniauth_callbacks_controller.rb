class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # Invoke skip_before_action for all providers that might use POST
  skip_before_action :verify_authenticity_token, only: [ :google_oauth2, :line, :apple ]

  def google_oauth2
    handle_auth("Google")
  end

  def line
    handle_auth("LINE")
  end

  def apple
    handle_auth("Apple")
  end

  def failure
    redirect_to new_user_session_path, alert: "ログインがキャンセルされました。"
  end

  private

  def handle_auth(kind)
    auth = request.env["omniauth.auth"]
    @user = User.from_omniauth(auth)

    if @user.persisted?
      # iOS 判定（params と omniauth.params の両対応）
      state_param = params[:state] || request.env.dig("omniauth.params", "state")
      ios_param   = params[:ios]   || request.env.dig("omniauth.params", "ios")

      if state_param == "ios" || ios_param == "true"
        # --- iOS Flow ---
        sign_in @user, event: :authentication

        # トークン生成（5分間有効）
        token = @user.signed_id(purpose: :ios_login, expires_in: 5.minutes)

        # ASWebAuthenticationSession を閉じるための Deep Link にトークンを付与
        redirect_to "okaimonote://auth/callback?token=#{token}", allow_other_host: true
      else
        # --- Web Flow (従来通り) ---
        sign_in_and_redirect @user, event: :authentication
        set_flash_message(:notice, :success, kind: kind) if is_navigational_format?
      end
    else
      # 新規登録画面へ遷移する場合、セッションに認証情報を保存
      # session key formats: devise.google_data, devise.line_data, devise.apple_data
      session_key = "devise.#{kind.downcase}_data"
      session[session_key] = auth.except(:extra)

      redirect_to new_user_registration_url
    end
  end
end
