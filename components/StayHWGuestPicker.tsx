"use client";

import { useEffect, useRef, useState } from "react";

// A custom (non-native <select>) guest count dropdown, shared by the search
// bar and a unit's booking card. Popup styling and motion match the date
// picker (dp-pop, rounded-2xl bg-paper-dim) so the two feel like one system.
export function StayHWGuestPicker({ value, onChange, max, anyLabel, label, id, variant = "bar" }: {
  value: number; onChange: (guests: number) => void; max: number;
  anyLabel?: string; // when set, 0 is a valid "no preference" value shown as this label
  label: string; // accessible name, e.g. "Guests"
  id?: string;
  variant?: "bar" | "sidebar"; // "bar": icon + inline text; "sidebar": stacked label + value
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // Keeps the highlighted option in view and lets arrow keys walk the list
  // without a full roving-tabindex implementation.
  function onListKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const buttons = [...(listRef.current?.querySelectorAll("button") ?? [])];
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = buttons[at + (event.key === "ArrowDown" ? 1 : -1)];
    next?.focus();
  }

  const options = anyLabel ? [0, ...Array.from({ length: max }, (_, i) => i + 1)] : Array.from({ length: max }, (_, i) => i + 1);
  const optionLabel = (n: number) => (n === 0 ? anyLabel! : `${n} guest${n === 1 ? "" : "s"}`);
  const display = value === 0 && anyLabel ? anyLabel : optionLabel(value);

  return (
    <div ref={root} className="relative min-w-0">
      <button type="button" id={id} onClick={() => setOpen((was) => !was)} aria-haspopup="listbox" aria-expanded={open}
        className={variant === "bar" ? "w-full min-w-0 cursor-pointer bg-transparent text-left outline-none" : "block w-full cursor-pointer text-left outline-none"}>
        {variant === "sidebar" && <span className="block text-[10px] font-bold uppercase tracking-wide">{label}</span>}
        <span className={`truncate ${variant === "sidebar" ? "text-[14px]" : value ? "" : "text-ink/55"}`}>{display}</span>
      </button>
      {open && (
        <div ref={listRef} role="listbox" aria-label={label} tabIndex={-1} onKeyDown={onListKeyDown}
          className="dp-pop absolute left-0 right-0 top-full z-40 mt-2 max-h-64 min-w-[10rem] overflow-y-auto rounded-2xl border border-line bg-paper-dim p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.6)] sm:right-auto sm:w-48">
          {options.map((n) => {
            const selected = n === value;
            return (
              <button key={n} type="button" role="option" aria-selected={selected} autoFocus={selected}
                onClick={() => { onChange(n); setOpen(false); }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[14px] transition-colors ${selected ? "bg-pine/15 font-medium text-pine" : "hover:bg-ink/10"}`}>
                {optionLabel(n)}
                {selected && <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 fill-none stroke-current" strokeWidth="2"><path d="m2.5 8.5 3.5 3.5 7.5-8" /></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
