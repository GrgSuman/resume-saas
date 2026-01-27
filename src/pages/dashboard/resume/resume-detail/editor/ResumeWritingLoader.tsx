'use client'

import { Skeleton } from "../../../../../components/ui/skeleton"

const ResumeWritingLoader = () => {
  return (
    <div className="w-full h-full relative bg-[#f9f8f7] overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-[#f9f8f7] animate-pulse"></div>

      {/* Skeleton Resume Preview */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 w-full max-w-4xl mx-auto p-6">
        <div className="w-full bg-white rounded-lg shadow-sm p-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <Skeleton className="h-8 w-64 mx-auto opacity-70" />
            <Skeleton className="h-5 w-48 mx-auto opacity-70" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-80 mx-auto opacity-60" />
              <Skeleton className="h-3 w-64 mx-auto opacity-60" />
            </div>
          </div>

          {/* Resume Sections */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 border-b border-gray-300 opacity-70" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full opacity-60" />
                <Skeleton className="h-3 w-full opacity-60" />
                <Skeleton className="h-3 w-3/4 opacity-60" />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32 border-b border-gray-300 opacity-70" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2 p-3 bg-gray-50 rounded-md">
                  <Skeleton className="h-4 w-3/4 opacity-60" />
                  <Skeleton className="h-3 w-1/2 opacity-60" />
                  <Skeleton className="h-3 w-2/3 opacity-60" />
                  <Skeleton className="h-3 w-full opacity-60" />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 border-b border-gray-300 opacity-70" />
              <div className="p-3 bg-gray-50 rounded-md space-y-2">
                <Skeleton className="h-4 w-3/4 opacity-60" />
                <Skeleton className="h-3 w-1/2 opacity-60" />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-16 border-b border-gray-300 opacity-50" />
              <div className="p-3 bg-gray-50 rounded-md">
                <Skeleton className="h-3 w-full opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Message - Full Screen Blocking */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #374151 0%,
            #374151 30%,
            #6b7280 40%,
            #d1d5db 47%,
            #ffffff 50%,
            #d1d5db 53%,
            #6b7280 60%,
            #374151 70%,
            #374151 100%
          );
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full flex items-start justify-center pt-20 z-[9999] bg-black/30 backdrop-blur-[1px] pointer-events-auto">
        <div className="flex flex-col bg-white rounded-xl px-8 py-6 shadow-lg max-w-md w-full mx-4" style={{ backgroundColor: '#ffffff' }}>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 animate-shimmer">
              Wait, let me prepare your resume...
            </h3>
          </div>
          <p className="text-base text-muted-foreground text-center">This won't take long.</p>
        </div>
      </div>
    </div>
  )
}

export default ResumeWritingLoader
