require 'rails_helper'

RSpec.describe "価格登録", type: :system do
  let!(:user) { create(:user) }
  let!(:category) { create(:category, user: user, name: "飲料") }
  let!(:shop) { create(:shop, user: user, name: "スーパーA") }
  let!(:product) { create(:product, user: user, category: category, name: "牛乳") }
  let!(:price_record) { build(:price_record, user: user, product: product, shop: shop) }

   before do
    visit new_user_session_path
    fill_in "メールアドレス", with: user.email
    fill_in "パスワード", with: user.password
    click_button "ログイン"
  end

  it "有効なファクトリーであること" do
    expect(price_record).to be_valid
  end

  describe "新規商品で価格登録" do
    it 'カテゴリーとお店を選択して登録できる' do
      new_price_record_path(mode: "new")

      fill_in "商品名", with: "ヨーグルト"
      select "飲料", from: "カテゴリー"
      fill_in "価格", with: 150
      fill_in "購入日", with: Date.today
      select "お店", from: "お店"
      fill_in "メモ", with: "広告の品"

      click_button "登録する"

      expect(page).to have_content "登録しました"
      expect(current_path).to eq home_path
    end
  end

  describe "既存商品で価格登録" do
    it "既存商品とお店を選択して登録する" do
      visit new_price_record_path(mode: "existing")

      select "飲料", from: "カテゴリーフィルター"
      select "牛乳", from: "商品"
      select "スーパーA", from: "お店"
      fill_in "価格",  with: 200
      fill_in "購入日", with: Date.today
      fill_in "メモ", with: "厳選特価"

      click_button "登録する"

      expect(page).to have_content "登録しました"
      expect(current_path).to eq home_path
    end
  end

  describe "価格履歴の編集・削除" do
    let!(:price_record) do
      create(:price_record,
        user: user,
        product: product,
        shop: shop,
        price: 198,
        purchased_at: Date.yesterday,
        memo: "特売")
    end

    it "履歴を編集できる" do
      visit edit_price_record_path(price_record)

      fill_in "価格", with: 210
      fill_in "メモ", with: "値上げ"
      click_button "更新する"

      expect(page).to have_content "更新しました"
      expect(page).to have_content "牛乳"
    end

    it "履歴を削除できる" do
      visit edit_price_record_path(price_record)

      accept_confirm do
        click_button "削除する"
      end

      expect(page).to have_content "削除しました"
      expect(current_path).to eq product_path(product)
    end
  end
end