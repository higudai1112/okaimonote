class Admin::DashboardsController < Admin::BaseController
  include AbnormalPriceDetector # concernsでprivateメソッドを共有
  def index
    @total_users    = User.count
    @active_users   = User.where("last_sign_in_at > ?", 30.days.ago).count
    @new_users_30d  = User.where("created_at > ?", 30.days.ago).count
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
