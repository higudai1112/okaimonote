class HomeController < ApplicationController
  def index
    @categories = Category.pluck(:name)
    @shops = Shop.pluck(:name)

    @q = current_user.price_records.ransack(params[:q])

    @price_records = @q.result.includes(:product, :shop).order(created_at: :desc).limit(10)

    latest_record = current_user.price_records.order(created_at: :desc).first

    if latest_record.present?
      set_summary(latest_record.product)
    else
      @selected_product = nil
      @price_records = []
    end
  end

  def show_summary
    product = Product.find(params[:id])
    set_summary(product)

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
    @last_purchased_at = latest&.created_at
  end
end
