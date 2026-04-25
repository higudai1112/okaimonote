# API v1 コントローラーの基底クラス
# 全APIエンドポイントで共通の認証・レスポンス処理を担当する
module Api
  module V1
    class BaseController < ApplicationController
      # APIはCSRFトークン不要（Cookieセッション認証はOriginで保護される）
      skip_before_action :verify_authenticity_token

      # ApplicationController の HTML リダイレクト版 BAN チェックを無効化し、
      # API 向けの JSON 版に差し替える
      skip_before_action :reject_banned_user
      before_action :authenticate_user!
      before_action :reject_banned_user_api

      private

      # 未認証時はHTMLリダイレクトではなく401 JSONを返す
      def authenticate_user!
        unless current_user
          render json: { error: "ログインが必要です" }, status: :unauthorized
        end
      end

      # BAN ユーザーには JSON 403 を返す（リダイレクトは行わない）
      def reject_banned_user_api
        return unless current_user&.status_banned?

        sign_out current_user
        render json: { error: "このアカウントは停止されています" }, status: :forbidden
      end
    end
  end
end
