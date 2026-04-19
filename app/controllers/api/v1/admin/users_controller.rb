module Api
  module V1
    module Admin
      class UsersController < BaseController
        before_action :set_user, only: [ :show, :update, :ban, :unban ]

        def index
          users = User.order(created_at: :desc)

          # キーワード検索（メール・ニックネーム）
          if params[:q].present?
            q = "%#{params[:q]}%"
            users = users.where("email LIKE ? OR nickname LIKE ?", q, q)
          end

          total = users.count
          page  = (params[:page] || 1).to_i
          per   = 20
          users = users.offset((page - 1) * per).limit(per)

          render json: {
            users: users.map { |u| user_json(u) },
            meta: { total: total, page: page, per: per }
          }
        end

        def show
          render json: user_json(@user, detail: true)
        end

        def update
          if @user.update(params.require(:user).permit(:admin_memo))
            render json: user_json(@user)
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def ban
          @user.update!(status: "banned", banned_reason: params[:reason])
          render json: user_json(@user)
        end

        def unban
          @user.update!(status: "active", banned_reason: nil)
          render json: user_json(@user)
        end

        private

        def set_user
          @user = User.find(params[:id])
        end

        def user_json(user, detail: false)
          data = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
            status: user.status,
            banned_reason: user.banned_reason,
            family_role: user.family_role,
            prefecture: user.prefecture,
            admin_memo: user.admin_memo,
            last_sign_in_at: user.last_sign_in_at,
            created_at: user.created_at
          }

          if detail
            data[:recent_price_records] = user.price_records
              .includes(:product, :shop)
              .order(created_at: :desc)
              .limit(5)
              .map { |r|
                {
                  id: r.id,
                  price: r.price,
                  product_name: r.product&.name,
                  shop_name: r.shop&.name,
                  purchased_at: r.purchased_at
                }
              }
            data[:recent_products] = user.products
              .order(created_at: :desc)
              .limit(5)
              .map { |p| { id: p.id, name: p.name } }
          end

          data
        end
      end
    end
  end
end
