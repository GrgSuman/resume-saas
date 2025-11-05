import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Rocket, FileText, ArrowLeftIcon } from "lucide-react";
import { manageLocalStorage } from "../../../lib/localstorage";

interface NewResumeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (resumeName: string, jobTitle?: string) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export default function ResumeDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: NewResumeFormProps) {
  const [step, setStep] = useState<"method" | "details">("method");
  const [method, setMethod] = useState<"empty" | "ai" | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("method");
      setMethod(null);
      setResumeName("");
      setJobTitle("");
    }
  }, [open]);

  const handleMethodSelect = (selectedMethod: "empty" | "ai") => {
    setMethod(selectedMethod);
    setStep("details");
  };

  const handleContinue = async () => {
    if (!resumeName.trim()) return;
    if (method === "ai" && !jobTitle.trim()) return;

    if(method === "ai"){
      manageLocalStorage.set("jobTitleForResume", jobTitle.trim());
    }
    onSubmit(resumeName.trim());
  };

  const handleBack = () => {
    setStep("method");
    setMethod(null);
  };

  const canContinue =
    resumeName.trim() &&
    (method === "empty" || (method === "ai" && jobTitle.trim()));

  return (
    <>
      <style>{`
        [data-slot="dialog-overlay"] {
          background-color: rgba(0, 0, 0, 0.7) !important;
        }
      `}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-2xl p-0 shadow-xl overflow-hidden"
          showCloseButton={true}
        >
          {step === "method" ? (
            <div className="p-8 md:p-10">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-semibold text-foreground">
                  Create Your Resume
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Select your preferred starting point
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                {/* AI generate option */}
                <button
                  onClick={() => handleMethodSelect("ai")}
                  className="group relative p-6 rounded-lg border border-border hover:border-primary bg-card hover:bg-accent/30 transition-all duration-200 text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-3">
                      <Rocket className="w-6 h-6 text-purple-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          AI Sample Resume
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI creates a sample starter resume for your role. Review it, then edit to match your experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Empty resume option */}
                <button
                  onClick={() => handleMethodSelect("empty")}
                  className="group relative p-6 rounded-lg border border-border hover:border-primary bg-card hover:bg-accent/30 transition-all duration-200 text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="w-6 h-6 text-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          Start from Scratch
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Begin with a blank template. Add your information and get AI assistance by chatting anytime.
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Details collection step */
            <div className="p-8 md:p-10">
              <Button
                onClick={handleBack}
                className="mb-4"
                size="sm"
                variant="ghost"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back
              </Button>

              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-semibold text-foreground mb-2">
                  {method === "ai"
                    ? "Let's Create Your Resume"
                    : "Name Your Resume"}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {method === "ai"
                    ? "Share your target role and we'll create a sample starter resume you can review and edit"
                    : "Give your resume a name. You can chat with AI anytime for help while building your resume."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Resume name field - always visible */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
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
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Choose a name that helps you identify this resume later
                  </p>
                </div>

                {/* Job title field - only for AI method */}
                {method === "ai" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
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
                      className="h-11"
                      autoFocus={false}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      AI will generate a sample starter resume for this role. You can review and edit it to match your experience.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleBack}
                  className="flex-1 h-10 px-4 rounded-md border border-border hover:bg-muted text-foreground font-medium transition-colors"
                >
                  Back
                </button>
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue || isLoading}
                  className="flex-1 h-10"
                >
                  {isLoading ? "Creating..." : method === "ai" ? "Generate Sample Resume" : "Create Resume"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
