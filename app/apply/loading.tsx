import { SiteHeader } from "@/components/SiteHeader";
import { Sk } from "@/components/StayHWSkeletons";

// Shown after "Reserve" while the request form loads StayHW's unit list.
export default function ApplyLoading() {
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand border-b border-line">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-5 sm:px-10 pt-32 pb-12">
          <Sk className="h-4 w-32" />
          <Sk className="mt-4 h-12 w-96 max-w-full" />
          <Sk className="mt-5 h-4 w-[34rem] max-w-full" />
          <Sk className="mt-2.5 h-4 w-[30rem] max-w-full" />
        </div>
      </div>
      <div role="status" aria-label="Loading the request form" className="mx-auto max-w-3xl w-full px-5 sm:px-10 py-12 sm:py-16 grid gap-5 sm:grid-cols-2">
        {["sm:col-span-2", "", "", "sm:col-span-2", "", ""].map((span, i) => <div key={i} className={span}><Sk className="h-3 w-24" /><Sk className="mt-2.5 h-11 w-full" /></div>)}
        <div className="sm:col-span-2"><Sk className="h-3 w-24" /><Sk className="mt-2.5 h-28 w-full" /></div>
        <Sk className="h-[52px] w-48 !rounded-full" />
      </div>
    </main>
  );
}
