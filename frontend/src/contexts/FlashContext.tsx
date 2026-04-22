"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type FlashType = "notice" | "alert" | "info";

interface FlashMessage {
  id: number;
  type: FlashType;
  message: string;
}

interface FlashContextValue {
  flash: (type: FlashType, message: string) => void;
  messages: FlashMessage[];
  dismiss: (id: number) => void;
}

const FlashContext = createContext<FlashContextValue | null>(null);

let nextId = 0;

/** フラッシュメッセージをグローバルに管理するプロバイダー */
export function FlashProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<FlashMessage[]>([]);

  const flash = useCallback((type: FlashType, message: string) => {
    const id = nextId++;
    setMessages((prev) => [...prev, { id, type, message }]);
    // 2.5秒後に自動消滅
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 2500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <FlashContext.Provider value={{ flash, messages, dismiss }}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useFlash must be used within FlashProvider");
  return ctx;
}
