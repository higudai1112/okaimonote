module Api
  module V1
    class ProfileController < BaseController
      # PATCH /api/v1/profile
      # ニックネーム・都道府県を更新する
      def update
        if current_user.update(profile_params)
          render json: {
            id: current_user.id,
            nickname: current_user.nickname,
            prefecture: current_user.prefecture,
            email: current_user.email,
            avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
          }
        else
          render json: { errors: current_user.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/profile/email
      # メールアドレスを変更する（現在のパスワードで本人確認）
      def update_email
        if current_user.update_with_password(
          email: params[:email],
          current_password: params[:current_password]
        )
          render json: { message: "メールアドレスを更新しました" }
        else
          render json: { errors: current_user.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/profile/password
      # パスワードを変更する（現在のパスワードで本人確認）
      def update_password
        if current_user.update_with_password(
          password: params[:password],
          password_confirmation: params[:password_confirmation],
          current_password: params[:current_password]
        )
          render json: { message: "パスワードを変更しました" }
        else
          render json: { errors: current_user.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      private

      def profile_params
        params.require(:user).permit(:nickname, :prefecture, :avatar)
      end
    end
  end
end
