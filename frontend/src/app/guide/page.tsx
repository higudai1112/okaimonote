import Link from "next/link";

/** 使い方ガイドページ（認証不要） */
export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3] text-gray-800 py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-orange-100">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          おかいもノート 使い方ガイド
        </h1>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            1. 価格を登録する
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            フッター中央の「＋」ボタンから価格を登録できます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            2. 価格サマリーを見る
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            ホーム画面の履歴カードをタップすると、その商品の価格サマリーが表示されます。
            最安値・最高値・平均価格・前回購入価格を簡単に確認できます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            3. お店リストを管理する
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            「お店リスト」では、よく使うお店を登録できます。
            新しくお店を追加すると、価格登録時にその店舗を選択できるようになります。
            既に登録済みの商品も、編集画面から購入店舗を後から設定・変更可能です。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            4. カテゴリーと商品を整理する
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            「カテゴリーリスト」からカテゴリーを追加・編集・削除できます。
            各カテゴリーに紐づいた商品は「商品リスト」から編集や削除も可能です。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            5. 買い物リスト機能を使う
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            「買い物リスト」では、必要なものをリスト化して管理できます。
            商品名の右側にあるアイコンから、編集や購入済みへの切り替えが可能です。
            買い物の進行状況がひと目で分かるため、買い忘れ防止にも役立ちます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            6. ワンポイント
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 leading-relaxed">
            <li>トップページの価格履歴は新しい順に5件まで表示されます。</li>
            <li>登録後の編集や削除は、各詳細ページの「︙」ボタンから行えます。</li>
            <li>メモ欄には自由にコメントを残せるので、特売情報などを記録しておくと便利です。</li>
            <li>よく使う商品名やお店は、入力時に候補が表示されるため素早く登録できます。</li>
          </ul>
        </section>

        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition"
          >
            タイトルに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
