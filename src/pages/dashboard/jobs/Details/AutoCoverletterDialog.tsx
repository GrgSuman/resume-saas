import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "../../../../components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "../../../../components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../api/axios";
import { cn } from "../../../../lib/utils";
import Quiz, { type QuestionWithAnswer } from "../components/Quiz";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../components/ui/tabs";
import axios from "axios";
import { toast } from "react-toastify";

interface AutoCoverletterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  resumeId: string;
  jobTitle:string
  isCoverLetterLoading: boolean;
  submitQuizToTailorCoverLetter: (resumeId: string, questionsWithAnswers: QuestionWithAnswer[]) => void;
}

const AutoCoverletterDialog = ({
  open,
  onOpenChange,
  jobId,
  resumeId,
  jobTitle,
  submitQuizToTailorCoverLetter,
  isCoverLetterLoading,
}: AutoCoverletterDialogProps) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"select" | "questions">("select");
  const [demoQuestions, setDemoQuestions] = useState<QuestionWithAnswer[]>([]);
  const [activeTab, setActiveTab] = useState<"main" | "tailored">(resumeId ? "tailored" : "main");

  // Fetch resumes
  const { data: mainResumes, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/"),
    enabled: open,
  });


  const handleStartQuestions = async () => {
    if (!selectedResume) return;

    try {
      setIsGenerating(true);
      const response = await axiosInstance.post(`/jobs/${jobId}/generate-cover-letter-questions`, {
        resumeId: selectedResume
      });
      setDemoQuestions(response.data.questions || []);
      setStep("questions");
    } catch (error) {
      console.error("Error generating cover letter questions:", error);
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data?.message || "Failed to generate cover letter questions");
      } else {
        toast.error("Failed to generate cover letter questions");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizSubmit = async (questionsWithAnswers: QuestionWithAnswer[]) => {
    if (!selectedResume) return;
    submitQuizToTailorCoverLetter(selectedResume, questionsWithAnswers);
  };

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
                  Select Resume
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {`Select a resume to tailor cover letter for ${jobTitle}`}
                </DialogDescription>
              </DialogHeader>
            )}

            <div className={cn("flex flex-col flex-1 min-h-0 overflow-hidden", step === "select" && "my-4")}>
              {step === "select" ? (
                <>
                  {/* Scrollable Content */}
                  <div className="flex-1 flex flex-col min-h-0 px-6 py-5 pt-2 overflow-y-auto">
                {!isLoading && (
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "main" | "tailored")}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <TabsList className="bg-slate-100 p-1 rounded-md inline-flex mb-4 self-start">
                      <TabsTrigger
                        value="main"
                        className="text-sm px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Main Resume
                      </TabsTrigger>
                      <TabsTrigger
                        value="tailored"
                        className="text-sm px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Tailored Resume
                      </TabsTrigger>
                    </TabsList>

                    {/* Main Resume Tab Content */}
                    <TabsContent value="main" className="mt-0 focus-visible:ring-0 flex-1 min-h-0">
                      {mainResumes?.data?.resumes?.filter((resume: { isTailoredResume: boolean }) => !resume.isTailoredResume).length === 0 ? (
                        <div className="text-center py-12 border border-slate-200 rounded-lg bg-slate-50">
                          <p className="text-sm text-slate-400">No main resumes available</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2.5">
                          {mainResumes?.data?.resumes?.filter((resume: { isTailoredResume: boolean }) => !resume.isTailoredResume).map((resume: { id: string; title: string; emoji: string }) => (
                            <button
                              key={resume.id}
                              type="button"
                              onClick={() => setSelectedResume(resume.id)}
                              disabled={isGenerating}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border",
                                selectedResume === resume.id
                                  ? "border-slate-900 bg-slate-50"
                                  : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
                                isGenerating && "opacity-50 cursor-not-allowed pointer-events-none"
                              )}
                            >
                              <span className="text-2xl">{resume.emoji || "📄"}</span>
                              <span className="text-sm font-medium line-clamp-1 flex-1 text-slate-900">
                                {resume.title}
                              </span>
                              {selectedResume === resume.id && (
                                <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Tailored Resume Tab Content */}
                    <TabsContent value="tailored" className="mt-0 focus-visible:ring-0 flex-1 min-h-0">
                      {mainResumes?.data?.resumes?.filter((resume: { isTailoredResume: boolean }) => resume.isTailoredResume).length === 0 ? (
                        <div className="text-center py-12 border border-slate-200 rounded-lg bg-slate-50">
                          <p className="text-sm text-slate-400">No tailored resumes available</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2.5">
                          {mainResumes?.data?.resumes?.filter((resume: { isTailoredResume: boolean }) => resume.isTailoredResume).map((resume: { id: string; title: string; emoji: string }) => (
                            <button
                              key={resume.id}
                              type="button"
                              onClick={() => setSelectedResume(resume.id)}
                              disabled={isGenerating}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border",
                                selectedResume === resume.id
                                  ? "border-slate-900 bg-slate-50"
                                  : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
                                isGenerating && "opacity-50 cursor-not-allowed pointer-events-none"
                              )}
                            >
                              <span className="text-2xl">{resume.emoji || "📄"}</span>
                              <span className="text-sm font-medium line-clamp-1 flex-1 text-slate-900">
                                {resume.title}
                              </span>
                              {selectedResume === resume.id && (
                                <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
                    {isLoading && (
                      <div className="flex items-center justify-center py-8 border border-slate-200 rounded-lg bg-slate-50">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Fixed Footer */}
                  <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 bg-white flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      disabled={isGenerating}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleStartQuestions}
                      disabled={!selectedResume || isGenerating}
                      size="sm"
                    >
                      {isGenerating ? (
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
                  questions={demoQuestions || []}
                  onSubmit={handleQuizSubmit}
                  isSubmitting={isCoverLetterLoading}
                />
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default AutoCoverletterDialog;

