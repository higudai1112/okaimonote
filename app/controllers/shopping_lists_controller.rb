class ShoppingListsController < ApplicationController
  def show
    @shopping_list = current_user.shopping_list
    @shopping_items = shopping_list.shopping_items.order(created_at: :desc)
    @shopping_item = current_user.shopping_items.new
  end
end
