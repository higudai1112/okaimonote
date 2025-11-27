class ShoppingListsController < ApplicationController
  before_action :set_shopping_list
  def show
    @shopping_items = @shopping_list.shopping_items.order(created_at: :desc)
    @shopping_item = @shopping_list.shopping_items.new
  end

  def delete_purchased
    @shopping_list.shopping_items.where(purchased: true).destroy_all

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to shopping_list_path, notice: "購入済みの商品を削除しました" }
    end
  end

  private

  def set_shopping_list
    @shopping_list = ShoppingList.find_or_create_by(family: current_user.family)
  end
end
