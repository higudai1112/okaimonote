class ShoppingItemsController < ApplicationController
  before_action :set_shopping_list
  before_action :set_shopping_item

  def create
    if @shopping_item.save
      redirect_to @shopping_list_path(@shopping_list)
    else
      redirect_ro @shopping_list_path(@shopping_list), alert: "商品を追加できませんでした"
    end
  end

  def update
    if @shopping_item.update(shopping_item_params)
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to shopping_list_path(@shopping_list)}
      end
    else
      redirect_to @shopping_list_path(@shopping_list), alert: "更新に失敗しました"
    end
  end

  def destroy
    @shopping_item.destroy
    redirect_to @shopping_list_path(@shopping_list), status: :see_other
  end

  private

  def set_shopping_list
    @shopping_list = current_user.shopping_lists.find(params[:shopping_list_id])
  end

  def set_shopping_item
    @shopping_item = @shopping_list.shopping_items.find(params[:id])
  end

  def shopping_item_params
    params.require(:shopping_item).permit(:name, :memo, :purchased)
  end
end
