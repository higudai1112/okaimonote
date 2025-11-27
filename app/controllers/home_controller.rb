class HomeController < ApplicationController
  def index
    users = current_user.family_scope_users
    @categories = Category.where(user: users)
    @shops = Shop.where(user: users)

    @q = PriceRecord.where(user: users).ransack(params[:q])

    @price_records = @q.result
                       .includes(:product, :shop, product: :category)
                       .order(created_at: :desc)
                       .limit(5)

    latest_record = PriceRecord.where(user: users).where.not(purchased_at: nil).order(purchased_at: :desc).first

    if latest_record.present?
      set_summary(latest_record.product)
    else
      @selected_product = nil
    end
  end

  def show_summary
    users = current_user.family_scope_users
    product = Product.where(user: users).find(params[:id])
    set_summary(product)

    respond_to do |format|
      format.turbo_stream
    end
  end

  def autocomplete
    query = params[:q].to_s.strip
    users = current_user.family_scope_users
    # よく使う候補（上位3件）
    frequent_items =
      Product.where(user: users)
             .left_joins(:price_records)
             .where("price_records.created_at > ?", 30.days.ago)
             .group(:id)
             .order("COUNT(price_records.id) DESC")
             .limit(3)

    if frequent_items.empty?
      frequent_items =
        Product.where(user: users)
               .left_joins(:price_records)
               .group(:id)
               .order("COUNT(price_records.id) DESC")
               .limit(3)
    end

    @frequent_ids = frequent_items.pluck(:id)

    # 前方一致
    starts_with = Product.where(user: users).where("name LIKE ?", "#{query}%")

    # 部分一致
    contains = Product.where(user: users).where("name LIKE ?", "%#{query}%")

    # 結合して uniq
    @suggestions = (frequent_items + starts_with + contains)
                     .uniq
                     .first(8)

    respond_to do |format|
      format.turbo_stream
    end
  end

  private

  def set_summary(product)
    histories = product.price_records.order(created_at: :desc)

    @selected_product = product
    @min_price = histories.minimum(:price)
    @max_price = histories.maximum(:price)
    @average_price = histories.average(:price)&.round
    latest = histories.first
    @last_price = latest&.price
    @last_purchased_at = latest&.purchased_at
  end
end
