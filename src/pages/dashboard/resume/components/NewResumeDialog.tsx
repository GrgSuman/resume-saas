import { useState, useEffect, useRef } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "../../../../components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Upload, FileText, Rocket, X } from "lucide-react";

interface NewResumeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (resumeName: string, jobTitle?: string, resumeFile?: File | null) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export default function NewResumeDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: NewResumeFormProps) {
  const [step, setStep] = useState<"method" | "details">("method");
  const [method, setMethod] = useState<"upload" | "linkedin" | "empty" | "ai" | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setStep("method");
      setMethod(null);
      setResumeName("");
      setJobTitle("");
      setResumeFile(null);
    }
  }, [open]);

  const handleMethodSelect = (selectedMethod: "upload" | "empty" | "ai") => {
    setMethod(selectedMethod);
    setStep("details");
  };

  const handleContinue = async () => {
    if (!resumeName.trim()) return;
    if (method === "ai" && !jobTitle.trim()) return;
    if (method === "upload" && !resumeFile) return;

    if (method === "ai") {
      onSubmit(resumeName.trim(), jobTitle.trim());
      return;
    }

    if (method === "upload") {
      onSubmit(resumeName.trim(), undefined, resumeFile);
      return;
    }

    onSubmit(resumeName.trim());
  };

  const handleBack = () => {
    setStep("method");
    setMethod(null);
    setResumeName("");
    setJobTitle("");
    setResumeFile(null);
  };

  const canContinue =
    resumeName.trim() &&
    (method === "empty" ||
      (method === "ai" && jobTitle.trim()) ||
      (method === "upload" && !!resumeFile));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        >
          <div className="max-h-[90vh] min-h-[60vh] flex flex-col p-0 gap-0 overflow-hidden bg-white shadow-xl rounded-lg border border-slate-200">
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 z-10">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
              <DialogTitle className="text-lg font-semibold text-slate-900">
                {step === "method"
                  ? "How would you like to create your resume?"
                  : method === "ai"
                    ? "What would you like to call your resume?"
                    : "What would you like to call your resume?"}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                {step === "method"
                  ? ""
                  : method === "ai"
                    ? ""
                    : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {step === "method" ? (
                <>
                  {/* Scrollable Content */}
                  <div className="flex-1 flex flex-col min-h-0 px-6 pt-0 pb-4 overflow-y-auto">
                    <div className="space-y-3">
                      {/* Start from Scratch */}
                      <button
                        type="button"
                        onClick={() => handleMethodSelect("empty")}
                        className="w-full p-4 rounded-xl text-left transition-all border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-900 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                              Start from Scratch
                            </h3>
                            <p className="text-xs text-slate-500">
                              Build from scratch with AI assistance anytime
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Upload Existing Resume */}
                      <button
                        type="button"
                        onClick={() => handleMethodSelect("upload")}
                        className="w-full p-4 rounded-xl text-left transition-all border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-900 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Upload className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                              Upload Existing Resume
                            </h3>
                            <p className="text-xs text-slate-500">
                              Upload PDF document
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Sample Resume for Your Profession */}
                      <button
                        type="button"
                        onClick={() => handleMethodSelect("ai")}
                        className="w-full p-4 rounded-xl text-left transition-all border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-900 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Rocket className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                              Sample Resume for Your Profession
                            </h3>
                            <p className="text-xs text-slate-500">
                              AI-generated sample resume tailored to your role
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Fixed Footer */}
                  <div className="flex items-center justify-end gap-2.5 px-6 pt-4 pb-4 bg-white flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                /* Details collection step */
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex-1 flex flex-col min-h-0 px-6 pt-0 pb-4 overflow-y-auto">
                    <div className="max-w-xl mx-auto w-full space-y-4">
                      {/* Resume name field - always visible */}
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1.5">
                          Resume Name
                        </label>
                        <Input
                          placeholder="e.g. Software Engineer Resume"
                          value={resumeName}
                          autoFocus
                          onChange={(e) => setResumeName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && canContinue) {
                              e.preventDefault()
                              handleContinue()
                            }
                          }}
                          className="h-11 shadow-none"
                        />
                      </div>

                      {/* Job title field - only for AI method */}
                      {method === "ai" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-1.5">
                            Target Job Title
                          </label>
                          <Input
                            placeholder="e.g. Senior Frontend Developer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && canContinue) {
                                e.preventDefault()
                                handleContinue()
                              }
                            }}
                            className="h-11 shadow-none"
                            autoFocus={false}
                          />
                        </div>
                      )}

                      {/* Job title field - only for AI method */}
                      {method === "upload" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-1.5">
                            Upload Resume
                          </label>
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
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setResumeFile(null);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  // PDF only (same UX as cover letter)
                                  if (file.type !== "application/pdf") {
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                    return;
                                  }

                                  // Max 5MB
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert("File size must be less than 5MB");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                    setResumeFile(null);
                                    return;
                                  }

                                  setResumeFile(file);
                                }}
                              />

                              <div
                                className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 h-11 text-sm transition hover:border-slate-300"
                                onClick={() => fileInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    fileInputRef.current?.click();
                                  }
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-7 w-7 flex items-center justify-center rounded-md bg-slate-100">
                                    <Upload className="h-4 w-4 text-slate-600" />
                                  </div>
                                  <span className="text-sm text-slate-700">
                                    Upload resume{" "}
                                    <span className="text-[10px] text-slate-500">PDF only</span>
                                  </span>
                                </div>
                                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                                  Browse
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed Footer */}
                  <div className="flex items-center justify-end gap-2.5 px-6 pt-4 pb-4 bg-white flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      disabled={isLoading}
                      size="sm"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinue}
                      disabled={!canContinue || isLoading}
                      className="bg-slate-900 text-white hover:bg-slate-800"
                      size="sm"
                    >
                      {isLoading ? "Creating..." : method === "ai" ? "Create My Resume" : "Create Resume"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
