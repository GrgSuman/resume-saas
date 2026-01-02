"use client"

import { useState } from "react"
import { ChevronDown, Clock, Target, CheckCircle2, AlertCircle, FileText } from "lucide-react"

interface PreviousAnalysis {
  id: string
  date: string
  mode: "general" | "tailored"
  summary: string
  jobTitle?: string
  atsScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  jobMatchPercentage?: number
  jobDescription?: string
}

interface AnalysisCardProps {
  analysis: PreviousAnalysis
  defaultExpanded?: boolean
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-50 text-green-700 border-green-200"
  if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200"
  return "bg-red-50 text-red-700 border-red-200"
}

const AnalysisCard = ({ analysis, defaultExpanded = false }: AnalysisCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border border-slate-200 rounded-lg bg-white">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>{analysis.date}</span>
              </div>
              {analysis.mode === "tailored" && analysis.jobTitle && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  <Target className="h-3 w-3" />
                  {analysis.jobTitle}
                </span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium border ${getScoreColor(
                    analysis.atsScore,
                  )}`}
                >
                  ATS: {analysis.atsScore}
                </span>
                {analysis.jobMatchPercentage && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    Match: {analysis.jobMatchPercentage}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{analysis.summary}</p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50/30">
          <div className="p-4 space-y-4">
            {analysis.jobDescription && (
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  <h5 className="text-sm font-medium text-slate-900">Target Job Description</h5>
                </div>
                <div className="text-xs text-slate-600 max-h-32 overflow-y-auto leading-relaxed">
                  {analysis.jobDescription}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <h5 className="text-sm font-medium text-slate-900">Strengths</h5>
                </div>
                <ul className="space-y-1.5">
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <h5 className="text-sm font-medium text-slate-900">Areas to Improve</h5>
                </div>
                <ul className="space-y-1.5">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-slate-900 mb-2">Recommendations</h5>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisCard
