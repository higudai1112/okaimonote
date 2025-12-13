module AbnormalPriceDetector
  extend ActiveSupport::Concern

  # -------------------------------------------
  # 異常値の検出処理
  # full: false → 件数 + 最大5件
  # full: true  → 全件返す
  # -------------------------------------------
  def find_abnormal_price_records(full: false)
    records = PriceRecord.includes(:product, :shop, :user).to_a
    return full ? [] : [ 0, [] ] if records.empty?

    grouped = records.group_by(&:product_id)
    abnormal_records = []

    grouped.each do |_product_id, recs|
      prices = recs.map(&:price).map(&:to_f)
      avg    = prices.sum / prices.size
      high   = avg * 2.0
      low    = avg * 0.5

      recs.each do |pr|
        price = pr.price.to_f
        next unless price >= high || price <= low

        deviation = (((price - avg) / avg) * 100).round(1)

        abnormal_records << {
          record: pr,
          avg_price: avg.round,
          deviation: deviation
        }
      end
    end

    if full
      abnormal_records.sort_by { |item| item[:record].created_at }.reverse
    else
      [ abnormal_records.count, abnormal_records.first(5) ]
    end
  end
end
