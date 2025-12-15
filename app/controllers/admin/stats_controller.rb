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
end
