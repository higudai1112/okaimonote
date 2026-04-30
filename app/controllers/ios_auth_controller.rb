class IosAuthController < ApplicationController
  # iOS からの fetch には CSRF トークンが無いため、この action のみ除外
  skip_before_action :verify_authenticity_token, only: :create
  skip_before_action :authenticate_user!, only: :create
  skip_before_action :reject_banned_user, only: :create

  def create
    user = User.find_signed!(
      params[:token],
      purpose: :ios_login
    )

    # BAN されたユーザーはセッション確立を拒否する
    if user.status_banned?
      return redirect_to new_user_session_path, alert: "このアカウントは停止されています。"
    end

    # remember_me を有効化してから sign_in することで、有効期限付き Cookie が発行される。
    # WKWebView はセッション Cookie（有効期限なし）をディスクに保存しないため、
    # フォースクイット後にログアウトしてしまう問題を防ぐ。
    user.remember_me!
    sign_in(user)

    # Cookie はレスポンスヘッダに自動で含まれる
    redirect_to home_path
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    redirect_to new_user_session_path, alert: "無効または期限切れのトークンです。"
  end
end
