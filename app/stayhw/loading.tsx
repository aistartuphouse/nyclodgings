import { SiteHeader } from "@/components/SiteHeader";
import { SearchBarSkeleton, Sk, UnitGridSkeleton } from "@/components/StayHWSkeletons";

// Shown while the server reads StayHW's catalogue (and availability, when dates are in the address).
export default function StayHWLoading() {
  return (
    <main className="bg-paper min-h-svh">
      <section className="relative bg-sand border-b border-line">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-5 sm:px-10 pt-28 pb-14">
          <SearchBarSkeleton />
          <Sk className="mt-12 h-4 w-28" />
          <Sk className="mt-8 h-4 w-52" />
          <Sk className="mt-4 h-16 w-72 max-w-full" />
          <Sk className="mt-4 h-4 w-64" />
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 sm:px-10 py-14 sm:py-20">
        <Sk className="h-9 w-80 max-w-full" />
        <Sk className="mt-4 h-4 w-[28rem] max-w-full" />
        <Sk className="mt-10 mb-6 h-4 w-24" />
        <UnitGridSkeleton />
      </div>
    </main>
  );
}
