module Api
  module V1
    module Admin
      class FamiliesController < BaseController
        before_action :set_family, only: [ :show, :change_admin, :remove_member ]

        def index
          families = Family.includes(:users).order(created_at: :desc)
          total    = families.count
          page     = (params[:page] || 1).to_i
          per      = 20
          families = families.offset((page - 1) * per).limit(per)

          render json: {
            families: families.map { |f| family_summary_json(f) },
            meta: { total: total, page: page, per: per }
          }
        end

        def show
          render json: family_detail_json(@family)
        end

        def change_admin
          new_admin = @family.users.find(params[:user_id])

          Family.transaction do
            @family.users.where(family_role: :family_admin)
                   .update_all(family_role: User.family_roles[:family_member])
            new_admin.update!(family_role: :family_admin)
            @family.update!(owner: new_admin)
          end

          render json: family_detail_json(@family.reload)
        rescue ActiveRecord::RecordNotFound
          render json: { error: "メンバーが見つかりません" }, status: :not_found
        end

        def remove_member
          user = User.find(params[:user_id])
          user.update!(family_id: nil, family_role: :personal)
          render json: { message: "#{user.nickname} さんをファミリーから除名しました" }
        rescue ActiveRecord::RecordNotFound
          render json: { error: "ユーザーが見つかりません" }, status: :not_found
        end

        private

        def set_family
          @family = Family.find(params[:id])
        end

        def family_summary_json(family)
          {
            id: family.id,
            name: family.name,
            members_count: family.users.size,
            created_at: family.created_at
          }
        end

        def family_detail_json(family)
          {
            id: family.id,
            name: family.name,
            invite_token: family.invite_token,
            members_count: family.users.count,
            created_at: family.created_at,
            members: family.users.order(created_at: :asc).map { |u|
              {
                id: u.id,
                nickname: u.nickname,
                email: u.email,
                family_role: u.family_role,
                created_at: u.created_at
              }
            }
          }
        end
      end
    end
  end
end
