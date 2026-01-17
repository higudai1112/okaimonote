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

    # Devise セッションを作成（Cookie を発行）
    sign_in(user)

    # Cookie はレスポンスヘッダに自動で含まれる
    render json: { status: "ok" }, status: :ok
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    render json: { error: "invalid or expired token" }, status: :unauthorized
  end
end
