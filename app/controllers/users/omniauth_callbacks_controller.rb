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

    # 認証情報からユーザーを検索・作成
    begin
      @user = User.from_omniauth(auth)
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "=== OMNIAUTH USER ERROR ==="
      Rails.logger.error e.message
      redirect_to new_user_session_path, alert: "ログインエラー: #{e.record.errors.full_messages.join(', ')}"
      return
    end

    unless @user.persisted?
      redirect_to new_user_session_path, alert: "#{kind}ログインに失敗しました。"
      return
    end

    sign_in @user
    @user.update_tracked_fields!(request)

    if ios_oauth?
      # iOS App Flow: Redirect to custom scheme (cookies handle the session)
      redirect_to ios_callback_url(@user), allow_other_host: true
    else
      # Web Flow: Standard redirect
      flash[:notice] = I18n.t("devise.omniauth_callbacks.success", kind: kind)
      redirect_to after_sign_in_path_for(@user)
    end
  end

  def ios_oauth?
    # Detect if 'state=ios' was passed in the initial request (stored in omniauth.params)
    # OR if the provider returned it in params[:state] explicitly.
    # Note: OmniAuth usually generates a random state, so checking omniauth.params is more reliable
    # if the client appended ?state=ios to the authorization URL.
    (request.env["omniauth.params"].present? && request.env["omniauth.params"]["state"] == "ios") ||
      params[:state] == "ios"
  end

  def ios_callback_url(user)
    # The session is already set by sign_in @user.
    # We simply redirect back to the app, which shares cookies with ASWebAuthenticationSession.
    "okaimonote://auth/callback"
  end
end
