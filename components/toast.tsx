"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { X } from "lucide-react";

type Toast = { id: number; message: string };

const ToastContext = createContext<(msg: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const add = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 border border-accent bg-paper px-4 py-3 shadow-lg toast-enter"
          >
            <span className="text-sm font-medium">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-ink/40 transition-colors hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
