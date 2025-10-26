module PriceRecordsHelper
  def summary_empty?(min_price, max_price, average_price, last_price)
    [ min_price, max_price, average_price, last_price ].all?(&:nil?)
  end

  def display_price(value)
    value.present? ? "#{value}円" : "未登録"
  end
end
