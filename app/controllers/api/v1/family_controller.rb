module Api
  module V1
    class FamilyController < BaseController
      before_action :require_family!, only: [ :show, :update, :destroy, :leave, :transfer_owner, :regenerate_invite ]
      before_action :require_family_admin!, only: [ :update, :destroy, :transfer_owner, :regenerate_invite ]

      # GET /api/v1/family
      def show
        render json: family_json(current_user.family)
      end

      # POST /api/v1/family
      def create
        if current_user.family.present?
          render json: { error: "すでにファミリーに所属しています" }, status: :unprocessable_entity
          return
        end

        family = Family.new(family_params)
        family.owner = current_user
        family.base_user = current_user

        ActiveRecord::Base.transaction do
          family.save!
          current_user.update!(family: family, family_role: :family_admin)
        end

        render json: family_json(family), status: :created
      rescue => e
        Rails.logger.error "[FamilyController#create] #{e.class}: #{e.message}"
        render json: { error: "作成できませんでした" }, status: :unprocessable_entity
      end

      # PATCH /api/v1/family
      def update
        if current_user.family.update(family_params)
          render json: family_json(current_user.family)
        else
          render json: { errors: current_user.family.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/family
      def destroy
        family = current_user.family
        ActiveRecord::Base.transaction do
          family.users.update_all(family_id: nil, family_role: User.family_roles[:personal])
          family.destroy!
        end
        render json: { message: "ファミリーを解散しました" }
      rescue => e
        Rails.logger.error "[FamilyController#destroy] #{e.class}: #{e.message}"
        render json: { error: "解散できませんでした" }, status: :unprocessable_entity
      end

      # DELETE /api/v1/family/leave
      def leave
        if current_user.family_admin?
          render json: { error: "管理者は権限を譲渡してから脱退してください" }, status: :unprocessable_entity
          return
        end

        current_user.update!(family_id: nil, family_role: :personal)
        render json: { message: "ファミリーから脱退しました" }
      end

      # PATCH /api/v1/family/transfer_owner
      def transfer_owner
        family = current_user.family
        new_owner = family.users.find_by(id: params[:member_id])

        unless new_owner
          render json: { error: "メンバーが見つかりません" }, status: :not_found
          return
        end

        if new_owner == current_user
          render json: { error: "自分自身に譲渡することはできません" }, status: :unprocessable_entity
          return
        end

        ActiveRecord::Base.transaction do
          family.update!(owner: new_owner)
          current_user.update!(family_role: :family_member)
          new_owner.update!(family_role: :family_admin)
        end

        render json: family_json(family.reload)
      rescue => e
        Rails.logger.error "[FamilyController#transfer_owner] #{e.class}: #{e.message}"
        render json: { error: "権限を譲渡できませんでした" }, status: :unprocessable_entity
      end

      # POST /api/v1/family/regenerate_invite
      def regenerate_invite
        current_user.family.regenerate_invite_token!
        render json: family_json(current_user.family)
      end

      private

      def require_family!
        unless current_user.family.present?
          render json: { error: "ファミリーに所属していません" }, status: :not_found
        end
      end

      def require_family_admin!
        unless current_user.family_admin?
          render json: { error: "権限がありません" }, status: :forbidden
        end
      end

      def family_params
        params.require(:family).permit(:name)
      end

      def family_json(family)
        {
          id: family.id,
          name: family.name,
          invite_token: family.invite_token,
          members_count: family.users.count,
          members: family.users.order(:id).map { |u|
            {
              id: u.id,
              nickname: u.nickname,
              family_role: u.family_role
            }
          }
        }
      end
    end
  end
end
