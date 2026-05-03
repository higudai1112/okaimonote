"use client";

import { useState, useCallback } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface ConfirmOptions {
  message: string;
  confirmLabel?: string;
  variant?: "default" | "danger";
}

interface ConfirmState {
  message: string;
  confirmLabel: string;
  variant: "default" | "danger";
  resolve: (value: boolean) => void;
}

/**
 * Promise ベースの確認モーダルフック。
 * iOS WKWebView では window.confirm が動作しないため、カスタムモーダルで代替する。
 *
 * 使い方:
 *   const { confirm, ConfirmModalElement } = useConfirm();
 *   if (!await confirm("削除しますか？")) return;
 *   // JSX に {ConfirmModalElement} を含めること
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback(
    (options: string | ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        const opts = typeof options === "string" ? { message: options } : options;
        setState({
          message: opts.message,
          confirmLabel: opts.confirmLabel ?? "実行する",
          variant: opts.variant ?? "default",
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setState((prev) => {
      prev?.resolve(true);
      return null;
    });
  }, []);

  const handleCancel = useCallback(() => {
    setState((prev) => {
      prev?.resolve(false);
      return null;
    });
  }, []);

  const ConfirmModalElement = state ? (
    <ConfirmModal
      message={state.message}
      confirmLabel={state.confirmLabel}
      variant={state.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmModalElement };
}
