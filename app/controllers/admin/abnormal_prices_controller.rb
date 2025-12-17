class Admin::AbnormalPricesController < Admin::BaseController
  include AbnormalPriceDetector # concernsでprivateメソッドを共有
  def index
    @abnormal_records = find_abnormal_price_records(full: true)
  end
end
