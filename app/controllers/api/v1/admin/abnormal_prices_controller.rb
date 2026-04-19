module Api
  module V1
    module Admin
      class AbnormalPricesController < BaseController
        include AbnormalPriceDetector

        def index
          abnormal = find_abnormal_price_records(full: true)

          records = abnormal.map do |item|
            pr = item[:record]
            {
              id: pr.id,
              price: pr.price,
              avg_price: item[:avg_price],
              deviation: item[:deviation],
              product_name: pr.product&.name,
              shop_name: pr.shop&.name,
              user_nickname: pr.user&.nickname,
              purchased_at: pr.purchased_at
            }
          end

          render json: records
        end
      end
    end
  end
end
