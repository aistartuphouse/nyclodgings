"use client";

// Interactive hero shell. The three.js orbit scene lives in OrbitCanvas and
// is code-split: it loads only on md+ viewports with working WebGL, so
// phones never download or execute the 3D bundle. Everyone else gets the
// hoverable concept-chip fallback; definitions work in both modes.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONCEPTS, type Concept } from "@/lib/concepts";

const OrbitCanvas = dynamic(() => import("./OrbitCanvas"));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export default function HeroField() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [broken, setBroken] = useState(false);
  const [active, setActive] = useState<Concept | null>(null);
  const [pinned, setPinned] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const [pinnedPos, setPinnedPos] = useState<{ x: number; y: number } | null>(null);
  const clearTimer = useRef<number | null>(null);

  const onActivate = useCallback((c: Concept | null, pin: boolean) => {
    if (clearTimer.current) {
      window.clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
    if (pin) {
      setActive(c);
      setPinned(true);
      setPinnedPos(cursorRef.current);
      return;
    }
    setPinned((isPinned) => {
      if (!isPinned) {
        if (c) {
          setActive(c);
        } else {
          // Grace period on hover-out kills card flicker while the pointer
          // slides between a glyph and its label.
          clearTimer.current = window.setTimeout(() => setActive(null), 220);
        }
      }
      return isPinned;
    });
  }, []);

  const clearPin = useCallback(() => {
    setPinned(false);
    setPinnedPos(null);
    setActive(null);
  }, []);

  useEffect(() => {
    const hasIdle = typeof window.requestIdleCallback === "function";
    const arm = () => {
      // Desktop-width only: the 3D bundle is pure cost on phones.
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
        if (gl) setReady(true);
      } catch {
        // leave ready=false, static fallback stays
      }
    };
    const id = hasIdle
      ? window.requestIdleCallback(arm)
      : window.setTimeout(arm, 120);
    return () => {
      if (hasIdle) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  const showCanvas = ready && !reduced && !broken;

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        cursorRef.current = pos;
        setCursor(pos);
      }}
    >
      {showCanvas && (
        <OrbitCanvas
          activeTerm={active?.term ?? null}
          onActivate={onActivate}
          onBroken={() => setBroken(true)}
          onClearPin={clearPin}
        />
      )}

      {/* Static fallback: mobile, no WebGL, reduced motion, or broken GPU
          output. Concept chips stay hoverable so definitions still work. */}
      {!showCanvas && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 hidden md:flex max-w-sm flex-wrap gap-2.5 justify-end">
            {CONCEPTS.map((c) => (
              <button
                key={c.term}
                type="button"
                onMouseEnter={() => onActivate(c, false)}
                onMouseLeave={() => onActivate(null, false)}
                onClick={() => onActivate(c, true)}
                className="border border-pine/35 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase text-pine hover:bg-pine hover:text-paper transition-colors cursor-pointer"
              >
                {c.term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Definition card: follows the cursor while hovering so it is always
          obvious which element it belongs to; a pinned (clicked) card stays
          where it was when pinned. On small screens it docks bottom. */}
      <div
        className={`pointer-events-none absolute z-20 w-[290px] max-w-[80vw] transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        } max-sm:!left-4 max-sm:!top-auto max-sm:bottom-6 max-sm:right-4 max-sm:w-auto`}
        style={(() => {
          const anchor = pinned ? (pinnedPos ?? cursor) : cursor;
          if (!anchor) return { right: 40, bottom: 40 };
          const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
          return {
            left: Math.min(anchor.x + 22, Math.max(40, vw - 330)),
            top: Math.max(anchor.y - 20, 84),
          };
        })()}
        aria-live="polite"
      >
        {active && (
          <div className="border border-pine/25 bg-sand/95 backdrop-blur-sm p-4 shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-pine">
              {active.term}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/80">
              {active.definition}
            </p>
            <div className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink/40">
              Taught at the residency{pinned ? " · click anywhere to dismiss" : ""}
            </div>
          </div>
        )}
      </div>

      {showCanvas && !active && (
        <div className="pointer-events-none absolute right-5 bottom-6 sm:right-10 sm:bottom-10 z-20 font-mono text-[10px] tracking-[0.18em] uppercase text-ink/40 hidden sm:block">
          Hover a concept to explore the curriculum
        </div>
      )}
    </div>
  );
}
