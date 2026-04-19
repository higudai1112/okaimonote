# 認証情報APIコントローラー
# Next.jsフロントエンドが起動時に現在のログインユーザー情報を取得するために使用する
module Api
  module V1
    class AuthController < BaseController
      # GET /api/v1/me
      # 現在のログインユーザー情報をJSONで返す
      def me
        render json: {
          id: current_user.id,
          email: current_user.email,
          nickname: current_user.nickname,
          role: current_user.role,
          family_role: current_user.family_role,
          prefecture: current_user.prefecture,
          avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
        }
      end
    end
  end
end
