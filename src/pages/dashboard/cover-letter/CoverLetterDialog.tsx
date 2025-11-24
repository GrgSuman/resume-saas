import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react"
import axiosInstance from "../../../api/axios"
import { useQuery } from "@tanstack/react-query"

interface CoverLetterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { 
    name: string
    resumeId: string
    jobDescription: string
    resumeFile?: File
    personalization?: {
      roleFocus: string
      standoutMoment: string
      tone: string
    }
  }) => void
  isCreating?: boolean
}

export default function CoverLetterDialog({ open, onOpenChange, onSubmit, isCreating = false }: CoverLetterDialogProps) {
  const [activeTab, setActiveTab] = useState("basics")
  const [name, setName] = useState("")
  const [selectedResume, setSelectedResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  
  // Personalization fields
  const [roleFocus, setRoleFocus] = useState("")
  const [standoutMoment, setStandoutMoment] = useState("")
  const [tone, setTone] = useState("professional")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const jobDescriptionWordCount = jobDescription.trim()
    ? jobDescription.trim().split(/\s+/).length
    : 0

    const {
      data: resumeData,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["resumes"],
      queryFn: () => axiosInstance.get("/resume/user"),
    });
  
    const resumes = resumeData?.data?.resume || [];

  useEffect(() => {
    if (!open) {
      setActiveTab("basics")
      setName("")
      setSelectedResume("")
      setJobDescription("")
      setResumeFile(null)
      setRoleFocus("")
      setStandoutMoment("")
      setTone("professional")
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      if(file.size > 5 * 1024 * 1024) {
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

  const handleSubmit = () => {
    if (!name.trim() || !selectedResume || !jobDescription.trim()) return
    if (selectedResume === "upload" && !resumeFile) return
  
    onSubmit({
      name: name.trim(),
      resumeId: selectedResume,
      jobDescription: jobDescription.trim(),
      resumeFile: resumeFile || undefined,
      personalization: {
        roleFocus: roleFocus.trim(),
        standoutMoment: standoutMoment.trim(),
        tone,
      }
    })
  }

  const basicsComplete = name.trim() && selectedResume && jobDescription.trim() && (selectedResume !== "upload" || resumeFile !== null)
  const canSubmit = basicsComplete

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-full min-h-[80vh] max-h-[95vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-4 border-b space-y-1.5">
            <h2 className="text-lg font-semibold text-slate-900">Create a cover letter</h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4">
              <TabsList className="bg-slate-100/80 p-1 rounded-xl w-fit">
                <TabsTrigger value="basics" className="px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900">
                  Basics
                </TabsTrigger>
                <TabsTrigger value="personalize" className="px-3 py-1.5 text-sm gap-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900">
                  Personalize
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <TabsContent value="basics" className="space-y-4 mt-0">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Cover Letter Name</label>
                  <Input
                    id="name"
                    value={name}
                    placeholder="e.g. Junior React Developer Cover Letter"
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-sm mt-[3px]"
                    disabled={isCreating}
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
                            disabled={isLoading || isError || isCreating}
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
                                  resumes.map((resume:{id:string, title:string, emoji:string}) => (
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
                            disabled={isCreating}
                          />

                          <label
                            htmlFor="resume-upload"
                            className={`flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 h-10 text-sm transition hover:border-slate-300 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Job Description</label>
                    <span className="text-[11px] text-slate-400">{jobDescriptionWordCount} words</span>
                  </div>

                  <div className="
                    rounded-xl 
                    border border-slate-200 
                    bg-slate-50
                    focus-within:bg-white
                    focus-within:border-indigo-200
                    transition-all
                    overflow-hidden
                  ">
                    <Textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="
                        h-[130px]
                        p-3
                        text-sm
                        leading-relaxed
                        resize-none
                        bg-transparent
                        border-0
                        focus-visible:ring-0
                      "
                      disabled={isCreating}
                    />

                    <div className="flex items-center justify-between border-t px-3 py-1.5 text-[11px] text-slate-500">
                      <span>Helps tailor tone and achievements</span>
                      <span>{jobDescription.length}/2000</span>
                    </div>
                  </div>
                </div>

                {/* Next Step Hint */}
                {basicsComplete && (
                  <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 flex items-start gap-2">
                    <div className="text-sm text-indigo-900">
                      <span className="font-medium">Ready to personalize?</span> Add context in the next tab for a more compelling letter, or skip and create now.
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="personalize" className="space-y-4 mt-0">
                {/* Question 1: Role Focus */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label htmlFor="roleFocus" className="text-sm font-medium text-slate-900">
                      What genuinely excites you most about this specific role?
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This creates a compelling hook for your opening that sounds authentic, not generic.
                    </p>
                  </div>
                  <Textarea
                    id="roleFocus"
                    className="h-20 resize-none overflow-y-auto bg-slate-50 focus:bg-white transition-colors"
                    placeholder="e.g. I've been following your sustainability initiative for years and want to contribute to scaling your carbon tracking platform..."
                    value={roleFocus}
                    onChange={(e) => setRoleFocus(e.target.value)}
                    disabled={isCreating}
                  />
                </div>

                {/* Question 2: Standout Moment */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label htmlFor="standoutMoment" className="text-sm font-medium text-slate-900">
                      Which achievement best proves you can handle this job?
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Share the full story with context that isn't visible on your resume. What made it challenging or meaningful?
                    </p>
                  </div>
                  <Textarea
                    id="standoutMoment"
                    className="h-20 resize-none overflow-y-auto bg-slate-50 focus:bg-white transition-colors"
                    placeholder="e.g. The resume says I increased sales by 20%, but I did it during a hiring freeze while mentoring two junior team members..."
                    value={standoutMoment}
                    onChange={(e) => setStandoutMoment(e.target.value)}
                    disabled={isCreating}
                  />
                </div>

                {/* Question 3: Tone */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-900">
                      Select the tone that matches your personality
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This controls the sentence structure and vocabulary of your letter.
                    </p>
                  </div>
                  <Select value={tone} onValueChange={setTone} disabled={isCreating}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Choose a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional & polished</SelectItem>
                      <SelectItem value="raw">Raw & authentic</SelectItem>
                      <SelectItem value="bold">Bold & confident</SelectItem>
                      <SelectItem value="enthusiastic">High energy</SelectItem>
                      <SelectItem value="analytical">Analytical & precise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </div>

            <div className="flex gap-2 border-t bg-slate-50 px-6 py-4">
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="flex-1 h-9 text-sm"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!canSubmit || isCreating} 
                className="flex-1 h-9 text-sm"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create cover letter"
                )}
              </Button>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}