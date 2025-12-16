class Admin::StatsController < Admin::BaseController
  def index
    # 検索パラメータ受け取り
    @keyword   = params[:keyword]     # 商品名
    @shop_name = params[:shop_name]   # 店舗名
    @pref      = params[:pref]        # 都道府県

    # まずは全 PriceRecord を対象にする
    records = PriceRecord.joins(:product, :shop)

    # -------------------------------
    # 商品名（必須ではないが、ある場合は優先）
    # -------------------------------
    if @keyword.present?
      records = records.where("products.name LIKE ?", "%#{@keyword}%")
    end

    # -------------------------------
    # 店舗名で絞り込み
    # -------------------------------
    if @shop_name.present?
      records = records.where("shops.name LIKE ?", "%#{@shop_name}%")
    end

    # -------------------------------
    # 都道府県で絞り込み
    # -------------------------------
    if @pref.present?
      records = records.joins(product: :user)
                       .where(users: { prefecture: @pref })
    end

    # 対象件数
    @count = records.count

    # 統計値（件数が0なら nil）
    @min_price = @count.zero? ? nil : records.minimum(:price)
    @max_price = @count.zero? ? nil : records.maximum(:price)
    @avg_price = @count.zero? ? nil : records.average(:price)&.to_f&.round(1)
    @median    = @count.zero? ? nil : calc_median(records)

    # -------------------------------------------------
    # ランキング TOP5
    # -------------------------------------------------

    # 1) **商品名の登録数 TOP5（Products count 順）**
    @top_products_count =
      Product.group(:name)
             .order("COUNT(id) DESC")
             .limit(5)
             .count

    # 2) **価格記録の多い商品 TOP5（PriceRecord 数順）**
    @top_products_by_records =
      Product.joins(:price_records)
             .group(:name)
             .order("COUNT(price_records.id) DESC")
             .limit(5)
             .count

    # 3) **登録数の多い店舗 TOP5**
    @top_shops =
      Shop.joins(:price_records)
          .group(:name)
          .order("COUNT(price_records.id) DESC")
          .limit(5)
          .count
  end

  def show
    @keyword = params[:keyword].presence

    unless @keyword
      redirect_to admin_stats_path, alert: "商品名が指定されていません"
      return
    end

    @shop_name = params[:shop_name].presence

    records = PriceRecord.joins(:shop, product: :user)
                         .includes(:shop, product: :user)
                         .where("products.name LIKE ?", "%#{@keyword}%")
                         .order(:purchased_at)

    filtered_records =
      if @shop_name.present?
        records.where(shops: { name: @shop_name })
      else
        records
      end

    @records = filtered_records
    @count = filtered_records.count

    if @count.zero?
      @min_price = @max_price = @avg_price = @median = nil
      @recent_records = []
      @median_by_shop = {}
      @median_by_pref = {}
      return
    end

    # 統計値
    @min_price = filtered_records.minimum(:price)
    @max_price = filtered_records.maximum(:price)
    @avg_price = filtered_records.average(:price)&.to_f&.round(1)
    @median = calc_median(filtered_records)

    # ↓ここから中央値の推移グラフ用
    @range = params[:range].presence || "30"

    days =
      case @range
      when "30"  then 30
      when "90"  then 90
      when "180" then 180
      when "365" then 365
      else 30
      end

    from = days.days.ago.to_date
    recent = filtered_records.where("purchased_at >= ?", from)

    # 日付ごとにグルーピング
    daily_groups = recent.group_by { |r| r.purchased_at.to_date }

    # 日別中央値を作成（日付順）
    daily_medians =
      daily_groups.map do |date, rs|
        prices = rs.map(&:price)
        median = calc_median_array(prices)
        next if median.nil?
        [ date, median ]
      end.compact
      .sort_by { |date, _| date }

    @chart_labels = daily_medians.map { |date, _| date.strftime("%m/%d") }
    @chart_values = daily_medians.map { |_, median| median }

    # 最新5件
    @recent_records = filtered_records.order(purchased_at: :desc).limit(5)

    # 店舗別中央値
    shop_groups = records.group_by { |r| r.shop&.name || "未登録" }

    @median_by_shop =
      shop_groups.map do |shop_name, rs|
        prices = rs.map(&:price)
        [
          shop_name,
          calc_median_array(prices),
          rs.size
        ]
      end

    # 都道府県別中央値
    pref_groups = records.group_by { |r| r.product.user.prefecture.presence || "未登録" }

    @median_by_pref =
      pref_groups.map do |pref, rs|
        prices = rs.map(&:price)
        [
          pref,
          calc_median_array(prices),
          rs.size
        ]
      end
  end

  def autocomplete_products
    keyword = params[:q].to_s.strip

    products = if keyword.present?
                 Product.where("name LIKE ?", "%#{keyword}%")
                        .group(:name)
                        .order("COUNT(*) DESC")
                        .limit(10)
                        .pluck(:name)
    else
                 []
    end

    render json: products
  end

  def autocomplete_shops
    keyword = params[:q].to_s.strip

    shops = if keyword.present?
              Shop.where("name LIKE ?", "%#{keyword}%")
                  .group(:name)
                  .order("COUNT(*) DESC")
                  .limit(10)
                  .pluck(:name)
    else
              []
    end

    render json: shops
  end

  private

  # 中央値の計算
  def calc_median(records)
    values = records.pluck(:price).sort
    return nil if values.empty?

    mid = values.length / 2

    if values.length.odd?
      values[mid]
    else
      ((values[mid - 1] + values[mid]) / 2.0).round
    end
  end

  def calc_median_array(values)
    values = values.compact.sort
    return nil if values.empty?

    mid = values.length / 2
    values.length.odd? ? values[mid] : ((values[mid - 1] + values[mid]) / 2.0).round
  end
end
