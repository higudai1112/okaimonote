namespace :guest do
  desc "ゲストユーザーを削除する（3日以上前に作成されたもの）"
  task cleanup: :environment do
    deleted_count = User.where("email LIKE ?", "guest_%@example.com")
                        .where("created_at < ?", 3.days.ago)
                        .delete_all

    puts "削除済みゲストユーザー数: #{deleted_count}"
  end
end