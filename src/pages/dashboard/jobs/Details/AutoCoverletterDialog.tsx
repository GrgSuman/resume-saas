import { useState } from "react";
import { Dialog, DialogContent } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../api/axios";
import { cn } from "../../../../lib/utils";

interface AutoCoverletterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  jobId: string;
}

interface Resume {
  id: string;
  title: string;
  emoji?: string;
  jobId?: string;
  jobSpaceId?: string;
}

const AutoCoverletterDialog = ({
  open,
  onOpenChange,
  jobTitle,
  jobId,
}: AutoCoverletterDialogProps) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch resumes
  const { data: resumeData, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/"),
    enabled: open,
  });

  const resumes = (resumeData?.data?.resumes || []) as Resume[];
  const mainResumes = resumes.filter((r) => !r.jobId && !r.jobSpaceId);

  const handleTailor = async () => {
    if (!selectedResume) return;

    setIsGenerating(true);

    // TODO: API call
    const payload = {
      resumeId: selectedResume,
      jobId,
    };
    console.log("Tailor:", payload);

    setTimeout(() => {
      setIsGenerating(false);
      onOpenChange(false);
      setSelectedResume("");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 shadow-2xl p-0 gap-0 bg-white">
        <div className="px-8 pt-8 pb-4 border-b border-zinc-100">
          <h2 className="text-xl font-medium text-zinc-900 mb-1">
            Tailor Cover Letter
          </h2>
          <p className="text-sm text-zinc-500">{jobTitle}</p>
        </div>

        <div className="px-8 py-6">
          <label className="text-xs tracking-wide uppercase text-zinc-400 font-medium mb-3 block">
            Select Resume
          </label>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
            </div>
          ) : mainResumes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-400">No resumes available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {mainResumes.map((resume) => (
                 <button
                   key={resume.id}
                   onClick={() => setSelectedResume(resume.id)}
                   className={cn(
                     "flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-lg text-center transition-all duration-200 border-2",
                     selectedResume === resume.id
                       ? "border-zinc-900 bg-white text-zinc-900 shadow-sm"
                       : "border-transparent bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-200"
                   )}
                 >
                   {resume.emoji && (
                     <span className="text-2xl leading-none">{resume.emoji}</span>
                   )}
                   <span className="text-xs tracking-tight font-medium line-clamp-2">
                     {resume.title}
                   </span>
                 </button>
              ))}
              
            </div>
          )}
        </div>

        <div className="px-8 pb-8">
          <Button
            onClick={handleTailor}
            size="lg"
            className="w-full text-sm tracking-tight"
            disabled={!selectedResume || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
            </>
            ) : (
              "Create tailored cover letter"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AutoCoverletterDialog;

