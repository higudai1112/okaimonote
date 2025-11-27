class ShoppingItemsController < ApplicationController
  before_action :set_shopping_list
  before_action :set_shopping_item, only: [ :edit, :update, :destroy ]

  def create
    @shopping_list = current_user.active_shopping_list

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

  def autocomplete
    query = params[:q].to_s.strip

    # よく使う候補（上位3件）
    users = current_user.family_scope_users
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

    starts_with = Product.where(user: users).where("name LIKE ?", "#{query}%")
    contains = Product.where(user: users).where("name LIKE ?", "%#{query}%")

    @suggestions = (frequent_items + starts_with + contains).uniq.first(8)

    respond_to do |format|
      format.turbo_stream
    end
  end


  private

  def set_shopping_list
    @shopping_list = ShoppingList.find_or_create_by(family: current_user.family)
  end

  def set_shopping_item
    @shopping_item = @shopping_list.shopping_items.find(params[:id])
  end

  def shopping_item_params
    params.require(:shopping_item).permit(:name, :memo)
  end
end
