#エラーが起きているのに次の処理をしようとしてアプリが壊れるのを防ぐ
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean
bundle exec rails db:migrate
#必要な gem（Rubyライブラリ）をインストール
#本番環境用の JavaScriptやCSSなど静的ファイルを生成
#古い静的アセットを削除して、デプロイ後の容量や不具合を防ぎます
#本番用PostgreSQLなどの環境で、db/migrate にある変更を反映