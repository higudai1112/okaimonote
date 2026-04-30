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

    # sign_in より前に remember_me attribute をセットする必要がある。
    # Devise の after_set_user フックは record.remember_me attribute が truthy の場合に
    # remember_me! を呼び出して永続 Cookie を発行する。
    # WKWebView はセッション Cookie（有効期限なし）をディスクに保存しないため、
    # iOS では常に永続 Cookie を発行してフォースクイット後もログイン維持する。
    user.remember_me = true
    sign_in(user)

    # Cookie はレスポンスヘッダに自動で含まれる
    redirect_to home_path
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    redirect_to new_user_session_path, alert: "無効または期限切れのトークンです。"
  end
end
