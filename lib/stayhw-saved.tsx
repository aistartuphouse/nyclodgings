"use client";

import { useMemo, useSyncExternalStore } from "react";

// Saved units live in this browser only. The in-memory copy keeps hearts
// working when localStorage is blocked (private windows, strict settings).
const SAVED_KEY = "stayhw-saved-units";
const savedListeners = new Set<() => void>();
let savedJson: string | null = null;

function readSaved(): string {
  if (savedJson === null) {
    try { savedJson = localStorage.getItem(SAVED_KEY) ?? "[]"; } catch { savedJson = "[]"; }
  }
  return savedJson;
}
function subscribeSaved(listener: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === SAVED_KEY) { savedJson = null; listener(); } };
  savedListeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => { savedListeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
function writeSaved(ids: number[]) {
  savedJson = JSON.stringify(ids);
  try { localStorage.setItem(SAVED_KEY, savedJson); } catch { /* memory copy still applies */ }
  savedListeners.forEach((listener) => listener());
}

export function useSavedUnits() {
  const json = useSyncExternalStore(subscribeSaved, readSaved, () => "[]");
  const saved = useMemo(() => {
    try { const ids: unknown = JSON.parse(json); return new Set(Array.isArray(ids) ? ids.filter((id): id is number => Number.isSafeInteger(id)) : []); }
    catch { return new Set<number>(); }
  }, [json]);
  const toggle = (id: number) => writeSaved(saved.has(id) ? [...saved].filter((other) => other !== id) : [...saved, id]);
  return { saved, toggle };
}

export function Heart({ filled, className = "size-6" }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={`${className} transition-transform duration-150 group-active/heart:scale-90`} style={{ fill: filled ? "#ff385c" : "rgba(0,0,0,0.5)", stroke: "#fff", strokeWidth: 2, overflow: "visible" }}>
      <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z" />
    </svg>
  );
}
