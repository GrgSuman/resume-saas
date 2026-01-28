import { useState, useEffect, useRef } from "react"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "../../../components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react"
import axiosInstance from "../../../api/axios"
import { useQuery } from "@tanstack/react-query"
import { cn } from "../../../lib/utils"
import Quiz, { type QuestionWithAnswer } from "../jobs/components/Quiz"
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router"

interface CoverLetterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    name: string
    resumeData: string
    jobDescription: string
    questionsWithAnswers: QuestionWithAnswer[]
  }) => void
  isCreating?: boolean
}

export default function CoverLetterDialog({ open, onOpenChange, onSubmit, isCreating = false }: CoverLetterDialogProps) {
  const [name, setName] = useState("")
  const [selectedResume, setSelectedResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [step, setStep] = useState<"select" | "quiz">("select")
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([])
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null)

  const jobDescriptionWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0

  const { data: resumeData, isLoading, isError } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/"),
  });

  const resumes = resumeData?.data?.resumes || [];

  useEffect(() => {
    if (!open) {
      setName("")
      setSelectedResume("")
      setJobDescription("")
      setResumeFile(null)
      setStep("select")
    }
  }, [open])

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setResumeFile(file)
      setSelectedResume("upload")
    } else {
      alert("Please upload a PDF file")
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleStartQuiz = async () => {
    if (!name.trim() || !selectedResume || !jobDescription.trim()) return
    if (selectedResume === "upload" && !resumeFile) return

    setIsGeneratingQuestions(true)
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("resumeId", selectedResume);
      formData.append("jobDescription", jobDescription);

      // Append file if it exists
      if (resumeFile) {
        formData.append("resumeFile", resumeFile);
      }

      const response = await axiosInstance.post("/cover-letter/generate-questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setQuestions(response.data.questions || [])
      setStep("quiz")
    } catch (e) {
      console.error("Error generating cover letter questions:", e)
      if (axios.isAxiosError(e)) {
        if (e?.response?.data?.message.includes("Monthly limit reached")) {
          navigate("/dashboard/pricing");
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
          });
        }
      } else {
        toast.error("Failed to generate cover letter questions")
      }
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const handleQuizSubmit = (questionsWithAnswers: QuestionWithAnswer[]) => {
    onSubmit({
      name: name.trim(),
      resumeData: selectedResume,
      jobDescription: jobDescription.trim(),
      questionsWithAnswers: questionsWithAnswers,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="max-h-[90vh] min-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white shadow-xl rounded-lg border border-slate-200">
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 z-10">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            {step === "select" && (
              <DialogHeader className="px-6 pt-6 flex-shrink-0">
                <DialogTitle className="text-lg text-slate-900">
                  Create Cover Letter
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Create a new cover letter
                </DialogDescription>
              </DialogHeader>
            )}

            <div className={cn("flex flex-col flex-1 min-h-0 overflow-hidden", step === "select" && "my-4")}>
              {step === "select" ? (
                <>
                  {/* Scrollable Content */}
                  <div className="flex-1 flex flex-col min-h-0 px-6 py-5 pt-2 overflow-y-auto">
                    <div className="flex flex-col flex-1 min-h-0 space-y-4">
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Cover Letter Name</label>
                        <Input
                          id="name"
                          value={name}
                          placeholder="e.g. Junior React Developer Cover Letter"
                          onChange={(e) => setName(e.target.value)}
                          className="h-9 text-sm mt-[3px]"
                          disabled={isGeneratingQuestions}
                        />
                      </div>

                      {/* Resume */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Resume</label>

                        {resumeFile ? (
                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                            <FileText className="h-4 w-4 text-slate-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{resumeFile.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {(resumeFile.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setResumeFile(null)
                                setSelectedResume("")
                                if (fileInputRef.current) fileInputRef.current.value = ""
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                              <div className="flex-1">
                                <Select
                                  value={selectedResume}
                                  onValueChange={setSelectedResume}
                                  disabled={isLoading || isError || isGeneratingQuestions}
                                >
                                  <SelectTrigger className="h-9 text-sm w-full">
                                    <SelectValue
                                      placeholder={
                                        isLoading
                                          ? "Loading resumes..."
                                          : isError
                                            ? "Failed to load resumes"
                                            : "Select a resume"
                                      }
                                    />
                                  </SelectTrigger>
                                  {isLoading ? (
                                    <SelectContent>
                                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Loading resumes...</span>
                                      </div>
                                    </SelectContent>
                                  ) : isError ? (
                                    <SelectContent>
                                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>Failed to load resumes</span>
                                      </div>
                                    </SelectContent>
                                  ) : (
                                    <SelectContent>
                                      {resumes.length === 0 ? (
                                        <div className="py-6 text-center text-sm text-slate-500">
                                          No resumes found
                                        </div>
                                      ) : (
                                        resumes.map((resume: { id: string, title: string, emoji: string }) => (
                                          <SelectItem key={resume.id} value={resume.id} className="text-sm">
                                            <div className="flex items-center gap-2">
                                              {resume.emoji} {resume.title}
                                            </div>
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  )}
                                </Select>
                                {isError && (
                                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Unable to load resumes. Please try uploading a file instead.
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-center text-[11px] uppercase tracking-wide text-slate-400 sm:w-12">
                                or
                              </div>

                              <div className="flex-1">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  id="resume-upload"
                                  disabled={isGeneratingQuestions}
                                />

                                <label
                                  htmlFor="resume-upload"
                                  className={`flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 h-10 text-sm transition hover:border-slate-300 ${isGeneratingQuestions ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 flex items-center justify-center rounded-md bg-slate-100">
                                      <Upload className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                      <span className="text-sm text-slate-700">Upload resume <span className="text-[10px] text-slate-500">PDF only</span></span>
                                    </div>
                                  </div>
                                  <span className="text-[11px] uppercase tracking-wide text-slate-400">Browse</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Job Description */}
                      <div className="flex flex-col flex-1 min-h-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700">Job Description</label>
                          <span className="text-[11px] text-slate-400">{jobDescriptionWordCount} words</span>
                        </div>

                        <div className="
                          flex flex-col flex-1 min-h-0
                          rounded-xl 
                          border border-slate-200 
                          focus-within:bg-white
                          focus-within:border-indigo-200
                          transition-all
                          overflow-hidden
                        ">
                          <Textarea
                            value={jobDescription || ""}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="
                                flex-1
                                min-h-0
                                p-3
                                text-sm
                                leading-relaxed
                                resize-none
                                bg-transparent
                                border-0
                                focus-visible:ring-0
                      "
                            disabled={isGeneratingQuestions}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Fixed Footer */}
                  <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 bg-white flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      disabled={isGeneratingQuestions}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleStartQuiz}
                      disabled={isGeneratingQuestions || (!name.trim() || !selectedResume || !jobDescription.trim() || (selectedResume === "upload" && !resumeFile))}
                      size="sm"
                    >
                      {isGeneratingQuestions ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mt-0.5" />
                          Generating...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <Quiz
                  questions={questions}
                  onSubmit={handleQuizSubmit}
                  isSubmitting={isCreating}
                />
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}