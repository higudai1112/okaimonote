class PriceRecordsController < ApplicationController
  before_action :set_price_record, only: [:edit, :update, :destroy]

  def edit; end

  def update
    if @price_record.update(price_record_params)
      redirect_to product_path(@price_record.product), notice: "更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @price_record.destroy!
    redirect_to product_path(@price_record.product), "削除しました", status: :see_other
  end

  private

  def set_price_record
    @price_record = current_user.price_records.find(params[:id])
  end

  def price_record_params
    params.require(:price_record).permit(:price, :memo, :purchased_at, :shop_id)
  end
end
