import { Skeleton } from "../../../../components/ui/skeleton";

const JobDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <header className="border-b border-zinc-100">
        <div className="mx-auto px-6 py-6">
          <Skeleton className="h-4 w-24 mb-6" />
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-64" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-1 w-1 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Documents Section Skeleton */}
            <section className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
              </div>
            </section>

            {/* Timeline Section Skeleton */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-6">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Job Description Section Skeleton */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-64 rounded-lg" />
            </section>
          </div>

          {/* Right Column - Notes Skeleton */}
          <div className="lg:col-span-1">
            <section className="space-y-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded" />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailsSkeleton;

