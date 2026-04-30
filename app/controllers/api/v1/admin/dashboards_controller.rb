module Api
  module V1
    module Admin
      class DashboardsController < BaseController
        def index
          today_start     = Time.zone.today.beginning_of_day
          yesterday_start = Time.zone.yesterday.beginning_of_day

          new_users_today     = User.where("created_at >= ?", today_start).count
          new_users_yesterday = User.where(created_at: yesterday_start...today_start).count

          current_30d_start  = 30.days.ago.beginning_of_day
          previous_30d_start = 60.days.ago.beginning_of_day

          new_users_30d      = User.where("created_at >= ?", current_30d_start).count
          new_users_prev_30d = User.where(created_at: previous_30d_start...current_30d_start).count

          unresolved_contacts = begin
            Contact.where(status: "unread").count
          rescue ActiveRecord::StatementInvalid => e
            Rails.logger.error "[DashboardsController] contacts クエリエラー: #{e.message}"
            0
          end

          top_products = Product
            .joins(:price_records)
            .group("products.name")
            .order("COUNT(price_records.id) DESC")
            .limit(5)
            .count
            .map { |name, count| { name: name, records_count: count } }

          top_shops = Shop
            .joins(:price_records)
            .group("shops.name")
            .order("COUNT(price_records.id) DESC")
            .limit(5)
            .count
            .map { |name, count| { name: name, records_count: count } }

          render json: {
            new_users_today: new_users_today,
            new_users_yesterday: new_users_yesterday,
            new_users_diff: new_users_today - new_users_yesterday,
            active_users: User.where("last_sign_in_at > ?", 30.days.ago).count,
            new_users_30d: new_users_30d,
            new_users_prev_30d: new_users_prev_30d,
            new_users_30d_diff: new_users_30d - new_users_prev_30d,
            total_families: Family.count,
            unresolved_contacts: unresolved_contacts,
            top_products: top_products,
            top_shops: top_shops
          }
        end
      end
    end
  end
end
