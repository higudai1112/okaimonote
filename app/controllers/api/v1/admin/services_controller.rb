module Api
  module V1
    module Admin
      class ServicesController < BaseController
        def index
          from = 30.days.ago
          active_users_count = PriceRecord.where("created_at >= ?", from).select(:user_id).distinct.count

          render json: {
            users_count: User.count,
            products_count: Product.count,
            price_records_count: PriceRecord.count,
            shops_count: Shop.count,
            families_count: Family.count,
            active_users_count: active_users_count,
            avg_records_per_user: active_users_count.zero? ? 0 :
              (PriceRecord.where("created_at >= ?", from).count / active_users_count.to_f).round(1),
            rails_version: Rails.version,
            ruby_version: RUBY_VERSION,
            env: Rails.env,
            db_connected: ActiveRecord::Base.connection.active?
          }
        end
      end
    end
  end
end
