"use client";

interface Props {
  message: string;
  confirmLabel?: string;
  /** "danger": 赤ボタン / "default": オレンジボタン */
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

/** iOS WKWebView で window.confirm が使えないため、カスタム確認モーダル */
export function ConfirmModal({
  message,
  confirmLabel = "実行する",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* オーバーレイ（タップでキャンセル） */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* モーダルカード */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-orange-100 p-6 z-10">
        <p className="text-base text-gray-700 text-center leading-relaxed mb-7">
          {message}
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
                : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
