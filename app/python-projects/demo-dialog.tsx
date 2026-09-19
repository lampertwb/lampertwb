"use client";

import { useEffect, useRef } from "react";

/* Shared modal for the click-to-open demos (email digest, weather explorer). */

export function DemoDialog({
  open,
  onClose,
  title,
  kicker,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="demo-dialog"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="demo-shell">
          <header className="demo-shell-head">
            <div>
              <div className="demo-kicker">{kicker}</div>
              <h2 className="demo-title">{title}</h2>
            </div>
            <button type="button" className="demo-close" onClick={onClose}>
              Close <span aria-hidden="true">✕</span>
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
