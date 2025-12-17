class Admin::DashboardsController < Admin::BaseController
  include AbnormalPriceDetector # concernsでprivateメソッドを共有
  def index
    # 当日比
    today_start     = Time.zone.today.beginning_of_day
    yesterday_start = Time.zone.yesterday.beginning_of_day

    @new_users_today =
      User.where("created_at >= ?", today_start).count

    @new_users_yesterday =
      User.where(created_at: yesterday_start...today_start).count

    @new_users_diff =
      @new_users_today - @new_users_yesterday
    @active_users   = User.where("last_sign_in_at > ?", 30.days.ago).count

    # 30日比
    current_30d_start = 30.days.ago.beginning_of_day
    previous_30d_start = 60.days.ago.beginning_of_day

    @new_users_30d =
      User.where("created_at >= ?", current_30d_start).count

    @new_users_prev_30d =
      User.where(created_at: previous_30d_start...current_30d_start).count

    @new_users_30d_diff =
      @new_users_30d - @new_users_prev_30d
    @total_families = Family.count

    # アラート用
    @unresolved_contacts =
      begin
        Contact.where(status: "unread").count
      rescue NameError, ActiveRecord::StatementInvalid
        0
      end

    # 異常価格アラート
    @abnormal_prices_count, @abnormal_price_records = find_abnormal_price_records

    # 統計ハイライト
    @top_products = Product
      .joins(:price_records)
      .group("products.name")
      .select("products.name AS name, COUNT(price_records.id) AS records_count")
      .order("records_count DESC")
      .limit(5)

    @top_shops = Shop
      .joins(:price_records)
      .group("shops.name")
      .select("shops.name AS name, COUNT(price_records.id) AS records_count")
      .order("records_count DESC")
      .limit(5)
  end
end
