# メール/パスワードによる JSON API ログイン・ログアウトを処理するコントローラー
# フロントエンド（Next.js）からのクロスオリインリクエストに対応するため
# HTML フォーム送信ではなく fetch ベースの JSON API として実装する
module Api
  module V1
    class SessionsController < BaseController
      # ログイン・ログアウトは認証不要
      skip_before_action :authenticate_user!, only: [ :create, :destroy ]

      # POST /api/v1/sessions
      # メールアドレスとパスワードでログインし、Devise セッションを確立する
      def create
        user = User.find_by(email: params[:email])
        if user&.valid_password?(params[:password])
          sign_in(user)
          # remember_me パラメータが "1" の場合は Devise の記憶機能を有効化
          user.remember_me! if params[:remember_me] == "1"
          render json: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role
          }
        else
          render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
        end
      end

      # DELETE /api/v1/sessions
      # 現在のセッションを破棄してログアウトする
      def destroy
        sign_out(current_user)
        render json: { message: "ログアウトしました" }
      end
    end
  end
end
