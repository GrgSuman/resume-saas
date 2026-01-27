import { Skeleton } from '../../../../../components/ui/skeleton'

const LoadingResumeDetail = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex h-screen">
        {/* Preview Area */}
        <div className="relative flex-1 p-4 xl:p-6 bg-[#f5f5f5]">
          {/* Top control bar skeleton */}
          <div className="absolute inset-x-4 top-4 z-10">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/90 backdrop-blur-sm shadow px-4 py-3 overflow-hidden">
              <div className="flex items-center gap-2 overflow-hidden">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md hidden sm:block" />
                <Skeleton className="h-6 w-24 rounded-md hidden lg:block" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-14 rounded-md" />
                <Skeleton className="h-7 w-24 rounded-md hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Resume Preview Skeleton */}
          <div className="h-full pt-24">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-4 xl:p-8 h-full overflow-hidden">
            {/* Resume Header */}
            <div className="text-center space-y-3 mb-8">
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-5 w-48 mx-auto" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-80 mx-auto" />
                <Skeleton className="h-3 w-64 mx-auto" />
              </div>
            </div>

            {/* Resume Content */}
            <div className="space-y-6">
              {/* Summary */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 border-b border-gray-300" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-32 border-b border-gray-300" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2 p-3 bg-gray-50 rounded-md">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 border-b border-gray-300" />
                <div className="p-3 bg-gray-50 rounded-md space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-16 border-b border-gray-300" />
                <div className="p-3 bg-gray-50 rounded-md">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="hidden xl:flex flex-col w-[420px] border-l border-gray-200 bg-white p-4 gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-3 flex-1">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoadingResumeDetail