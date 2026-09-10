"use client";

import { useState } from "react";
import { createApplication } from "@/lib/api";
import { BUILDING_LIST, roomTypesFor, rateHeadline, type BuildingSlug } from "@/lib/buildings";

// TEMPORARY (2026-09-10): capitol-deluxe exists on the site before migration
// 0010 has run on prod, and the backend answers unknown_building for a slug
// it has no row for. Until then send the parent slug and name the room in
// the message. Delete both helpers once 0010 is live.
const ROOMS_PENDING_ON_PROD: Record<string, { building: string; label: string }> = {
  "capitol-deluxe": { building: "capitol", label: "Capitol Deluxe" },
};
function pendingRoomSlug(slug: string): string {
  return ROOMS_PENDING_ON_PROD[slug]?.building ?? slug;
}
function pendingRoomNote(slug: string): string {
  const p = ROOMS_PENDING_ON_PROD[slug];
  return p ? `Room preference: ${p.label}.\n\n` : "";
}
import { formatMoney, todayNY } from "@/lib/format";

// The preference is a building slug ("seton") or a room-type slug
// ("capitol-loft"); the backend accepts both and the housing team reads it.
export function ApplyForm({
  source,
  initialPreference,
}: {
  source?: string | null;
  initialPreference?: string | null;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const result = await createApplication({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      building: pendingRoomSlug(String(data.get("building") ?? "")) || undefined,
      moveIn: String(data.get("moveIn") ?? "") || undefined,
      moveOut: String(data.get("moveOut") ?? "") || undefined,
      upgradeInterest: data.get("upgradeInterest") === "on",
      message: pendingRoomNote(String(data.get("building") ?? "")) + String(data.get("message") ?? ""),
      source,
    }).catch(() => ({ error: { error: "network" } }));
    setSubmitting(false);
    if ("error" in result) {
      setError("Something in the form needs attention. Check the fields and try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-pine text-paper p-8 sm:p-10">
        <h2 className="font-display text-2xl">Request received</h2>
        <p className="mt-3 text-paper/75 leading-relaxed max-w-lg">
          The housing team will come back to you by email with the room, the
          exact price including tax, and a payment link. No payment or
          commitment is required at this stage.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border border-line bg-sand px-3.5 py-2.5 text-[15px] placeholder:text-mist focus:border-teal-dim";
  const labelCls = "font-mono text-[11px] tracking-[0.18em] uppercase text-ink/55";

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="a-name" className={labelCls}>Full name</label>
        <input id="a-name" name="name" required minLength={2} className={`${inputCls} mt-2`} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="a-email" className={labelCls}>Email</label>
        <input id="a-email" name="email" type="email" required className={`${inputCls} mt-2`} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="a-phone" className={labelCls}>Phone</label>
        <input id="a-phone" name="phone" type="tel" className={`${inputCls} mt-2`} autoComplete="tel" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="a-building" className={labelCls}>Preferred room</label>
        <select
          id="a-building"
          name="building"
          className={`${inputCls} mt-2`}
          defaultValue={initialPreference ?? ""}
        >
          <option value="">No preference yet</option>
          {BUILDING_LIST.map((b) => (
            <optgroup key={b.slug} label={`${b.name}, ${b.city} (${b.minStay.toLowerCase()})`}>
              <option value={b.slug}>Any room at {b.name}</option>
              {roomTypesFor(b.slug as BuildingSlug).map((r) => {
                const h = rateHeadline(r.rate);
                return (
                  <option key={r.slug} value={r.slug}>
                    {b.name} {r.name} ({formatMoney(h.amountCents)}/{h.unit})
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="a-movein" className={labelCls}>Move-in</label>
          <input id="a-movein" name="moveIn" type="date" min={todayNY()} className={`${inputCls} mt-2`} />
        </div>
        <div>
          <label htmlFor="a-moveout" className={labelCls}>Move-out</label>
          <input id="a-moveout" name="moveOut" type="date" className={`${inputCls} mt-2`} />
        </div>
      </div>
      <label className="flex items-start gap-3 text-[15px] text-ink/75 cursor-pointer sm:pt-8">
        <input type="checkbox" name="upgradeInterest" className="mt-1 size-4 accent-teal-dim" />
        I am interested in a larger room, suite, or apartment
      </label>
      <div className="sm:col-span-2">
        <label htmlFor="a-message" className={labelCls}>Message</label>
        <textarea
          id="a-message"
          name="message"
          rows={4}
          className={`${inputCls} mt-2 resize-y`}
          placeholder="Tell us what you are looking for"
        />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {error && (
        <p className="sm:col-span-2 border border-pine/30 bg-pine/5 px-4 py-3 text-[14px] text-pine" role="alert">
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-10 py-4 transition-colors hover:bg-pine-deep disabled:opacity-40"
        >
          {submitting ? "Sending" : "Send request"}
        </button>
      </div>
    </form>
  );
}
