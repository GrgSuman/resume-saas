'use client'

import { Loader2 } from "lucide-react"

const CoverLetterWritingLoader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white/60 ">
      <div className="flex h-full items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-10 py-8 shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-slate-700" />
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-slate-900">Crafting your cover letter…</p>
            <p className="text-sm text-slate-500">We’re polishing wording and tone</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverLetterWritingLoader

