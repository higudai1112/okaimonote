# API v1 コントローラーの基底クラス
# 全APIエンドポイントで共通の認証・レスポンス処理を担当する
module Api
  module V1
    class BaseController < ApplicationController
      # APIはCSRFトークン不要（Cookieセッション認証はOriginで保護される）
      skip_before_action :verify_authenticity_token

      before_action :authenticate_user!

      private

      # 未認証時はHTMLリダイレクトではなく401 JSONを返す
      def authenticate_user!
        unless current_user
          render json: { error: "ログインが必要です" }, status: :unauthorized
        end
      end
    end
  end
end
