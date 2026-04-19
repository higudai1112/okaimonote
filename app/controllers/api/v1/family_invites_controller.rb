module Api
  module V1
    class FamilyInvitesController < BaseController
      skip_before_action :authenticate_user!, only: [ :show ]

      # GET /api/v1/family_invites/:token
      # 認証不要: 招待リンクを開いたとき（未ログインでも家族名などを表示したい）
      def show
        family = Family.find_by(invite_token: params[:token])
        unless family
          render json: { error: "無効な招待リンクです" }, status: :not_found
          return
        end

        render json: {
          name: family.name,
          members_count: family.users.count,
          remaining_slots: family.remaining_slots
        }
      end

      # POST /api/v1/family_invites/:token/join
      def join
        family = Family.find_by(invite_token: params[:token])
        unless family
          render json: { error: "無効な招待リンクです" }, status: :not_found
          return
        end

        if current_user.family_admin? || current_user.family_member?
          render json: { error: "すでに別のファミリーに所属しています" }, status: :unprocessable_entity
          return
        end

        Family.transaction do
          family.lock!
          if family.full?
            render json: { error: "このファミリーは上限人数(#{Family::MAX_MEMBERS}名)に達しています" },
                   status: :unprocessable_entity
            return
          end

          current_user.update!(family: family, family_role: :family_member)
        end

        render json: { message: "ファミリーに参加しました", family_name: family.name }
      rescue => e
        render json: { error: "参加できませんでした" }, status: :unprocessable_entity
      end

      # POST /api/v1/family_invites/apply_code
      def apply_code
        raw = params[:invite_token].to_s.strip

        if raw.blank?
          render json: { error: "招待コードを入力してください" }, status: :unprocessable_entity
          return
        end

        # URL全体添付でも末尾部分だけ抽出
        token = raw.split("/").last

        family = Family.find_by(invite_token: token)
        unless family
          render json: { error: "招待コードが無効です" }, status: :not_found
          return
        end

        render json: { invite_token: family.invite_token }
      end
    end
  end
end
