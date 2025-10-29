import { Skeleton } from '../../../components/ui/skeleton'

const LoadingResumeDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        
        {/* Left Column - Settings */}
        <div className="w-80 border-r border-gray-200 bg-white p-4">
          <div className="space-y-6">
            {/* Edit Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>

            {/* Template Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>

            {/* Typography Controls */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-16" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Center Column - Resume Preview */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
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

        {/* Right Column - Chat */}
        <div className="w-80 border-l border-gray-200 bg-white p-4">
          <div className="space-y-4">
            {/* Chat Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Chat Messages */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="space-y-2">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingResumeDetail