# 新規会員登録を JSON API として提供するコントローラー
module Api
  module V1
    class RegistrationsController < BaseController
      # 登録は未認証で行う
      skip_before_action :authenticate_user!
      skip_before_action :reject_banned_user_api

      # POST /api/v1/registrations
      # メールアドレス・パスワード・ニックネームでユーザーを新規作成する
      def create
        user = User.new(registration_params)

        if user.save
          render json: { message: "確認メールを送信しました。メールをご確認ください。" }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def registration_params
        params.permit(:email, :password, :password_confirmation, :nickname)
      end
    end
  end
end
