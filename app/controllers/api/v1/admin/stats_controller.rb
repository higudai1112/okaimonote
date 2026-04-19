module Api
  module V1
    module Admin
      class StatsController < BaseController
        def index
          keyword   = params[:keyword]
          shop_name = params[:shop_name]
          pref      = params[:pref]

          records = PriceRecord.joins(:product, :shop)

          records = records.where("products.name LIKE ?", "%#{keyword}%") if keyword.present?
          records = records.where("shops.name LIKE ?", "%#{shop_name}%") if shop_name.present?
          if pref.present?
            records = records.joins(product: :user).where(users: { prefecture: pref })
          end

          count = records.count

          top_products_by_records = Product
            .joins(:price_records)
            .group(:name)
            .order("COUNT(price_records.id) DESC")
            .limit(5)
            .count
            .map { |name, c| { name: name, count: c } }

          top_shops = Shop
            .joins(:price_records)
            .group(:name)
            .order("COUNT(price_records.id) DESC")
            .limit(5)
            .count
            .map { |name, c| { name: name, count: c } }

          render json: {
            count: count,
            min_price: count.zero? ? nil : records.minimum(:price),
            max_price: count.zero? ? nil : records.maximum(:price),
            avg_price: count.zero? ? nil : records.average(:price)&.to_f&.round(1),
            top_products_by_records: top_products_by_records,
            top_shops: top_shops
          }
        end

        def autocomplete_products
          keyword  = params[:q].to_s.strip
          products = keyword.present? ? Product.where("name LIKE ?", "%#{keyword}%")
                                                .group(:name).order(Arel.sql("COUNT(*) DESC")).limit(10).pluck(:name) : []
          render json: products
        end

        def autocomplete_shops
          keyword = params[:q].to_s.strip
          shops   = keyword.present? ? Shop.where("name LIKE ?", "%#{keyword}%")
                                           .group(:name).order(Arel.sql("COUNT(*) DESC")).limit(10).pluck(:name) : []
          render json: shops
        end
      end
    end
  end
end
