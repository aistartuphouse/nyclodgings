import { SiteHeader } from "@/components/SiteHeader";
import { UnitPageSkeleton } from "@/components/StayHWSkeletons";

// Shown while the server reads the condo's photos, details and calendar from StayHW.
export default function StayHWUnitLoading() {
  return (
    <main className="relative bg-paper min-h-svh">
      <SiteHeader />
      <UnitPageSkeleton />
    </main>
  );
}
