# パスワードリセットを JSON API として提供するコントローラー
module Api
  module V1
    class PasswordsController < BaseController
      # パスワードリセットは未認証で行う
      skip_before_action :authenticate_user!
      skip_before_action :reject_banned_user_api

      # POST /api/v1/passwords
      # パスワードリセットメールを送信する
      def create
        user = User.find_by(email: params[:email])

        if user
          user.send_reset_password_instructions
        end

        # ユーザーの有無に関わらず同じメッセージを返す（メール存在確認攻撃を防ぐ）
        render json: { message: "パスワードリセットのメールを送信しました。メールをご確認ください。" }
      end

      # PATCH /api/v1/passwords
      # リセットトークンを使ってパスワードを変更する
      def update
        user = User.reset_password_by_token(
          reset_password_token: params[:reset_password_token],
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        )

        if user.errors.empty?
          render json: { message: "パスワードを変更しました。ログインしてください。" }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
