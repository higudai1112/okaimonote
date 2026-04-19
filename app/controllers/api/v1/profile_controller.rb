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

      private

      def profile_params
        params.require(:user).permit(:nickname, :prefecture)
      end
    end
  end
end
