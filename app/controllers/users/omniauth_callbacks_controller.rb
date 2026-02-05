class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, only: [ :apple ]
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
    Rails.logger.error "=== OMNIAUTH CALLBACK DEBUG ==="
    Rails.logger.error "omniauth.params: #{request.env['omniauth.params'].inspect}"
    Rails.logger.error "omniauth.auth: #{request.env['omniauth.auth'].present?}"
    Rails.logger.error "request.fullpath: #{request.fullpath}"

    auth = request.env["omniauth.auth"]

    # DEBUG: Appleのauth情報を詳細に出力
    if kind == "Apple"
      Rails.logger.error "=== APPLE AUTH INFO DEBUG ==="
      Rails.logger.error "auth.uid: #{auth.uid}"
      Rails.logger.error "auth.info.email: #{auth.info.email}"
      Rails.logger.error "auth.info.name: #{auth.info.name}"
      Rails.logger.error "auth.extra.raw_info: #{auth.extra&.raw_info.inspect}"
    end

    begin
      @user = User.from_omniauth(auth)
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "=== OMNIAUTH SAVE ERROR ==="
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error "Validation Errors: #{e.record.errors.full_messages}"
      redirect_to new_user_session_path, alert: "ログインエラー: #{e.record.errors.full_messages.join(', ')}"
      return
    end

    unless @user.persisted?
      flash[:alert] = "#{kind}ログインに失敗しました。"
      return redirect_to new_user_session_path
    end

    sign_in @user
    @user.update_tracked_fields!(request)

    if ios_oauth?
      redirect_to ios_callback_url(@user), allow_other_host: true
    else
      flash[:notice] = I18n.t("devise.omniauth_callbacks.success", kind: kind)
      redirect_to home_path
    end
  end

  def ios_oauth?
    params[:state] == "ios"
  end

  def ios_callback_url(user)
    token = user.signed_id(
      purpose: :ios_login,
      expires_in: 10.minutes
    )
    "okaimonote://auth/callback?token=#{token}"
  end
end
