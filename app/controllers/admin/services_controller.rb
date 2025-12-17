class Admin::ServicesController < Admin::BaseController
  def index
    # ① サービス概要（累積）
    @users_count        = User.count
    @products_count     = Product.count
    @price_records_count = PriceRecord.count
    @shops_count        = Shop.count
    @families_count     = Family.count

    # ② 利用状況（直近30日）
    from = 30.days.ago

    @active_users_count =
      PriceRecord.where("created_at >= ?", from)
                 .select(:user_id)
                 .distinct
                 .count

    @avg_records_per_user =
      if @active_users_count.zero?
        0
      else
        PriceRecord.where("created_at >= ?", from).count / @active_users_count
      end

    @zero_record_users_count =
      User.left_joins(:price_records)
          .group("users.id")
          .having("COUNT(price_records.id) = 0")
          .count
          .size

    # ③ 将来の課金指標（仮）
    @premium_candidate_users =
      User.joins(:price_records)
          .group("users.id")
          .having("COUNT(price_records.id) >= ?", 50)
          .count
          .size

    @large_families_count =
      Family.joins(:users)
            .group("families.id")
            .having("COUNT(users.id) >= 3")
            .count
            .size

    # 仮：エリア統計対象
    @area_stat_users_count =
      User.joins(:price_records)
          .distinct
          .count

    # ④ システム情報
    @rails_version = Rails.version
    @ruby_version  = RUBY_VERSION
    @env           = Rails.env
    @db_connected  = ActiveRecord::Base.connection.active?
  end
end
