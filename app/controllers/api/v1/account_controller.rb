# アカウント削除 API
module Api
  module V1
    class AccountController < BaseController
      # DELETE /api/v1/account
      # ログアウト後にアカウントを削除する
      def destroy
        user = current_user
        sign_out user
        user.destroy!
        render json: { message: "アカウントを削除しました" }
      end
    end
  end
end
