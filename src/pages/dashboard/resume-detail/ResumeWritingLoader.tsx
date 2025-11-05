'use client'

import { Skeleton } from "../../../components/ui/skeleton"
import { Loader2 } from "lucide-react"

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
      <div className="fixed inset-0 w-full h-full flex items-start justify-center pt-[10%] z-[9999] bg-white/40 backdrop-blur-[3px] pointer-events-auto">
        <div className="flex flex-col items-center text-center space-y-3 bg-white/90 backdrop-blur-md rounded-xl px-8 py-6 shadow-lg animate-fadeIn">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h3 className="text-2xl font-semibold text-gray-800 animate-pulse">
            Wait, let me prepare your resume<span className="animate-bounce">...</span>
          </h3>
          <p className="text-lg text-muted-foreground">This won't take long.</p>
        </div>
      </div>
    </div>
  )
}

export default ResumeWritingLoader
