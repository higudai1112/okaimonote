class AccountsController < ApplicationController
  # 削除確認画面
  def delete; end # 表示するだけ

  # 実際の削除処理
  def destroy
    user = current_user

    # ログアウト → 削除
    sign_out user
    user.destroy!

    redirect_to root_path, notice: "アカウントを削除しました。ご利用ありがとうございました。"
  end
end
