class ShoppingItemsController < ApplicationController
  before_action :set_shopping_list
  before_action :set_shopping_item, only: [ :edit, :update, :destroy ]

  def create
    @shopping_item = @shopping_list.shopping_items.new(shopping_item_params)
    if @shopping_item.save
      redirect_to shopping_list_path(@shopping_list)
    else
      redirect_to shopping_list_path(@shopping_list), alert: "商品を追加できませんでした"
    end
  end

  def edit
    respond_to do |format|
      format.turbo_stream
      format.html
    end
  end

  def update
    respond_to do |format|
      if params[:shopping_item] && params[:shopping_item].keys.any? { |k| %w[name memo].include?(k) }
        # 編集モーダル更新
        if @shopping_item.update(shopping_item_params)
          format.turbo_stream { render "update_from_edit" }
          format.html { redirect_to shopping_list_path(@shopping_list) }
        else
          format.html { redirect_to shopping_list_path(@shopping_list), alert: "更新に失敗しました" }
        end
      else
        # 購入済みトグル切り替え
        if @shopping_item.update(purchased: !@shopping_item.purchased)
          format.turbo_stream
          format.html { redirect_to shopping_list_path(@shopping_list) }
        else
          redirect_to shopping_list_path(@shopping_list), alert: "更新に失敗しました"
        end
      end
    end
  end

  def destroy
    @shopping_item.destroy
    redirect_to shopping_list_path(@shopping_list), status: :see_other
  end

  private

  def set_shopping_list
    @shopping_list = current_user.shopping_list
  end

  def set_shopping_item
    @shopping_item = @shopping_list.shopping_items.find(params[:id])
  end

  def shopping_item_params
    params.require(:shopping_item).permit(:name, :memo)
  end
end
