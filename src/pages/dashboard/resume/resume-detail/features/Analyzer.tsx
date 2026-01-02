import { Dialog, DialogContent } from "../../../../../components/ui/dialog"
import { Button } from "../../../../../components/ui/button"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import { X, Target, AlertCircle, Sparkles, FileText } from "lucide-react"
import { useState } from "react"
import AnalysisCard from "./AnalysisCard"

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

interface AnalyzerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockAnalyses: PreviousAnalysis[] = [
  {
    id: "1",
    date: "2 hours ago",
    mode: "general",
    summary: "General analysis of the resume",
    atsScore: 80,
    strengths: ["Strong communication skills", "Problem-solving skills"],
    weaknesses: ["Weak in leadership skills", "Needs improvement in project management"],
    recommendations: ["Improve leadership skills", "Improve project management skills"],
    jobTitle: "Software Engineer",
    jobMatchPercentage: 80,
    jobDescription: "A software engineer with 5 years of experience in developing web applications using React and Node.js.",
  },
  {
    id: "2",
    date: "1 hour ago",
    mode: "tailored",
    summary: "Tailored analysis of the resume for the job of Software Engineer",
    atsScore: 90,
    strengths: ["Strong communication skills", "Problem-solving skills"],
    weaknesses: ["Weak in leadership skills", "Needs improvement in project management"],
    recommendations: ["Improve leadership skills", "Improve project management skills"],
    jobTitle: "Software Engineer",
    jobMatchPercentage: 90,
    jobDescription: "A software engineer with 5 years of experience in developing web applications using React and Node.js.",
  }
]

const Analyzer = ({ open, onOpenChange }: AnalyzerProps) => {
  const [jobDescription, setJobDescription] = useState("")
  const [showJobDescDialog, setShowJobDescDialog] = useState(false)
  const [tempJobDescription, setTempJobDescription] = useState("")
  const [previousAnalyses] = useState<PreviousAnalysis[]>(mockAnalyses)

  const handleStartAnalysis = () => {
    console.log("Starting general analysis")
  }

  const handleOpenJobDescDialog = () => {
    setTempJobDescription(jobDescription)
    setShowJobDescDialog(true)
  }

  const handleSaveJobDescription = () => {
    setJobDescription(tempJobDescription)
    setShowJobDescDialog(false)
  }

  const handleCloseJobDescDialog = () => {
    setShowJobDescDialog(false)
  }

  const hasJobDescription = jobDescription.trim().length > 0

  return (
    <>
      {/* Job Description Dialog */}
      <Dialog open={showJobDescDialog} onOpenChange={handleCloseJobDescDialog}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
          className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {hasJobDescription ? "Update Job Description" : "Add Job Description"}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Paste the full job posting for tailored recommendations
              </p>
            </div>
            <button
              onClick={handleCloseJobDescDialog}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <textarea
              value={tempJobDescription}
              onChange={(e) => setTempJobDescription(e.target.value)}
              placeholder="Paste the complete job description here including job title, responsibilities, qualifications, and required skills..."
              className="w-full min-h-[360px] p-4 text-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background leading-relaxed transition-shadow"
            />
            <p className="flex items-start gap-2 text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>More details = better keyword matching and tailored recommendations</span>
            </p>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseJobDescDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveJobDescription} className="bg-gray-900 text-white hover:bg-gray-800">
              {hasJobDescription ? "Update" : "Add"} Job Description
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Analyzer Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
          className="min-w-[75vw] max-w-5xl h-[95vh] border-0 p-0 overflow-hidden rounded-xl flex flex-col bg-white gap-0"
        >
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Resume Analysis</h3>
              <p className="text-sm text-slate-500">Get actionable feedback to improve your resume</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto space-y-6">
              {!hasJobDescription && (
                <Alert className="border-slate-200 bg-slate-50">
                    <FileText className="h-4 w-4 text-slate-600 mt-1" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">
                      Add a target job description for better recommendations, keyword matching, and analysis.
                    </span>
                    <Button
                      onClick={handleOpenJobDescDialog}
                      size="sm"
                      variant="outline"
                      className="ml-4"
                    >
                      <Target className="h-3.5 w-3.5 mr-1.5" />
                      Add Job
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {hasJobDescription && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-600" />
                    <div>
                      <span className="text-sm font-medium text-slate-900">Target job description added</span>
                      <span className="text-xs text-slate-500 ml-2">({jobDescription.length} characters)</span>
                    </div>
                  </div>
                  <Button onClick={handleOpenJobDescDialog} size="sm" variant="ghost" className="text-xs">
                    Edit
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">My Analysis History</h4>
                </div>

                {previousAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {previousAnalyses.map((analysis, index) => (
                      <AnalysisCard key={analysis.id} analysis={analysis} defaultExpanded={index === 0} />
                    ))}
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg bg-white p-6">
                    <div className="text-center max-w-md mx-auto">
                      <h5 className="text-base font-medium text-slate-900 mb-2">No analysis history</h5>
                      <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                        Get started for detailed feedback on ATS optimization, strengths, areas for improvement, and actionable recommendations.
                      </p>
                      <Button onClick={handleStartAnalysis} size="sm" className="bg-gray-900 text-white font-medium text-xs hover:bg-gray-800">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Resume
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
            <Button 
              onClick={handleStartAnalysis} 
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create New Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Analyzer
