# 管理画面：設定情報 API
module Api
  module V1
    module Admin
      class SettingsController < BaseController
        # GET /api/v1/admin/settings
        # サービス設定値を返す
        def show
          render json: {
            max_family_members: Family::MAX_MEMBERS
          }
        end
      end
    end
  end
end
