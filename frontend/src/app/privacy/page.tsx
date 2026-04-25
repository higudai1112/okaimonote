"use client";

import Link from "next/link";

/** プライバシーポリシーページ（認証不要） */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-orange-100 p-8 md:p-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-orange-500 mb-10">
          プライバシーポリシー
        </h1>

        <div className="space-y-10 leading-relaxed text-base text-gray-800">
          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">お客様から取得する情報</h2>
            <p>当サービスでは、お客様から以下の情報を取得する場合があります。</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
              <li>氏名（ニックネームやペンネームを含む）</li>
              <li>メールアドレス</li>
              <li>生年月日または年齢</li>
              <li>住所</li>
              <li>プロフィール画像</li>
              <li>外部サービスでの連携情報</li>
              <li>Cookie（クッキー）や端末識別子</li>
              <li>アクセス履歴、入力履歴、利用履歴など</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">お客様の情報を利用する目的</h2>
            <p>取得した情報は、以下の目的で利用いたします。</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
              <li>サービス利用登録および認証のため</li>
              <li>お問い合わせ対応やご連絡のため</li>
              <li>利用履歴や購入履歴の管理のため</li>
              <li>サービス品質向上・改善のため</li>
              <li>不正利用防止やセキュリティ向上のため</li>
              <li>規約や法令に基づく対応のため</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">安全管理のための措置</h2>
            <p>
              当サービスでは、取得した情報の漏洩・滅失・毀損を防止するため、組織的・技術的な安全管理措置を講じています。具体的な措置内容については、法令に基づき個別に回答いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">第三者提供</h2>
            <p>
              当サービスでは、法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
              <li>外部業務委託に伴う提供</li>
              <li>事業譲渡・合併等に伴う提供</li>
              <li>共同利用の場合（別途公表）</li>
              <li>その他、法令により提供が認められる場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">アフィリエイト広告について</h2>
            <p>
              当サービスでは、第三者が提供する成果報酬型広告（アフィリエイトプログラム）を利用する場合があります。
            </p>
            <p className="mt-3">
              これらの広告リンクを経由して商品やサービスを購入または申込みされた場合、当サービスに報酬が発生することがあります。
            </p>
            <p className="mt-3">
              アフィリエイトプログラムにおいては、広告効果の測定のため、第三者が Cookie（クッキー）等の技術を用いてユーザーのアクセス情報を取得する場合があります。これにより取得される情報には、氏名・住所・メールアドレスなどの個人を特定する情報は含まれません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">プライバシーポリシーの変更</h2>
            <p>
              当サービスは、必要に応じて本ポリシーの内容を変更する場合があります。変更内容は、本サイト上での告知またはメール等でお知らせいたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-500 mb-3">お問い合わせ</h2>
            <p>
              お客様の情報の開示・訂正・利用停止・削除をご希望の場合は、
              <Link href="/contact" className="text-orange-500 underline hover:text-orange-700 transition">
                お問い合わせフォーム
              </Link>
              よりご連絡ください。ご本人確認の上、法令に従い対応いたします。
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              ※情報開示請求に際しては、手数料（1件あたり1,000円）をいただく場合があります。
            </p>
          </section>

          <section className="text-sm text-gray-500 mt-8">
            <p>2025年10月26日 制定</p>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/settings"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-full shadow transition"
          >
            戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
