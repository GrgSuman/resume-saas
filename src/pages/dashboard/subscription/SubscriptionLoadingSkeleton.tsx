import { Skeleton } from "../../../components/ui/skeleton";

const SubscriptionLoadingSkeleton = () => {
  // Skeleton for Usage Item
  const UsageItemSkeleton = () => (
    <div className="flex flex-col space-y-3 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-5 w-16 rounded" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
          {/* LEFT: Usage List */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              
              <div className="space-y-6">
                <UsageItemSkeleton />
                <div className="h-px bg-slate-100" />
                <UsageItemSkeleton />
                <div className="h-px bg-slate-100" />
                <UsageItemSkeleton />
                <div className="h-px bg-slate-100" />
                <UsageItemSkeleton />
                <div className="h-px bg-slate-100" />
                <UsageItemSkeleton />
              </div>
            </div>
          </div>

          {/* RIGHT: Plan Details */}
          <div className="space-y-4">
            {/* Plan Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-2">
                  <Skeleton className="h-8 w-16 rounded" />
                  <Skeleton className="h-4 w-8 rounded" />
                </div>
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded mt-1" />
              </div>

              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Feature List */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <Skeleton className="h-3 w-32 rounded mb-3" />
              <ul className="space-y-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-3.5 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionLoadingSkeleton;

