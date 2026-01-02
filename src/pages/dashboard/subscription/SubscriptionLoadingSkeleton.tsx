import { Skeleton } from "../../../components/ui/skeleton";

const SubscriptionLoadingSkeleton = () => {
  // Skeleton for Usage Card - entire card as skeleton
  const UsageCardSkeleton = () => (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      {/* Numbers */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1.5 mb-1">
          <Skeleton className="h-8 w-12 rounded" />
          <Skeleton className="h-5 w-8 rounded" />
        </div>
        <Skeleton className="h-3 w-16 rounded mt-0.5" />
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto space-y-8 max-w-6xl">
        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            My Subscription
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View your current plan, usage, and billing details.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* USAGE SECTION */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                  Usage this billing period
                </h3>
                <p className="text-xs text-slate-500">
                  Renews on start of next month
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <UsageCardSkeleton />
                <UsageCardSkeleton />
                <UsageCardSkeleton />
                <UsageCardSkeleton />
                <UsageCardSkeleton />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* CURRENT PLAN CARD */}
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 shadow-xs hover:shadow-sm transition-shadow">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-24 rounded mb-2" />
                  <div className="flex items-center gap-2.5 flex-wrap mb-3">
                    <Skeleton className="h-7 w-20 rounded" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap mb-3">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-4 w-10 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionLoadingSkeleton;

