"use client";

import { useFlash } from "@/contexts/FlashContext";

/** フラッシュメッセージ表示コンポーネント。画面下部（ボトムナビの上）に固定表示 */
export function FlashMessage() {
  const { messages, dismiss } = useFlash();

  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col gap-2 px-4 pb-[env(safe-area-inset-bottom)]">
      {messages.map((m) => {
        const styles = {
          notice: {
            container: "border-green-400 bg-green-50 text-green-700",
            icon: "✓",
          },
          alert: {
            container: "border-red-400 bg-red-50 text-red-700",
            icon: "!",
          },
          info: {
            container: "border-gray-400 bg-gray-50 text-gray-700",
            icon: "i",
          },
        }[m.type];

        return (
          <div
            key={m.id}
            className={`flex items-center gap-2 border-l-4 p-3 rounded-xl shadow-sm text-sm font-medium ${styles.container}`}
            onClick={() => dismiss(m.id)}
          >
            <span className="text-lg font-bold">{styles.icon}</span>
            <p className="grow">{m.message}</p>
          </div>
        );
      })}
    </div>
  );
}
