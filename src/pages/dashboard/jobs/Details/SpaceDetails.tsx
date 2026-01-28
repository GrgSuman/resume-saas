import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "../../../../components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { SelectContent } from "../../../../components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { MapPin, ExternalLink, FileText, PenSquare, Clock, CheckCircle2, Archive, Trash2, X, CalendarIcon, Briefcase, Bookmark, MoreVertical, Pencil, Folder, MessageSquare, ClockIcon, AlignLeft, Check, Loader2, RefreshCw } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { Job, Status, TimelineEntry } from "../../types/jobs";
import axiosInstance from "../../../../api/axios";
import { toast } from "react-toastify";
import TrackJobFormEdit from "./TrackJobFormEdit";
import JobDetailsSkeleton from "./JobDetailsSkeleton";
import JobDetailsError from "./JobDetailsError";
import AutoResumeDialog from "./AutoResumeDialog";
import AutoCoverletterDialog from "./AutoCoverletterDialog";
import { getFaviconUrl } from "../../../../lib/utils";
import type { QuestionWithAnswer } from "../components/Quiz";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const STATUS_CONFIG: Record<
  Status,
  { label: string; icon: React.ElementType; color: string }
> = {
  Saved: {
    label: "Saved",
    icon: Bookmark,
    color: "text-slate-700 bg-slate-100",
  },
  Applied: {
    label: "Applied",
    icon: CheckCircle2,
    color: "text-slate-700 bg-slate-100",
  },
  Interviewing: {
    label: "Interviewing",
    icon: Clock,
    color: "text-slate-700 bg-slate-100",
  },
  Offer: {
    label: "Offer",
    icon: CheckCircle2,
    color: "text-slate-700 bg-slate-100",
  },
  Rejected: {
    label: "Rejected",
    icon: X,
    color: "text-slate-700 bg-slate-100",
  },
  Archived: {
    label: "Archived",
    icon: Archive,
    color: "text-slate-700 bg-slate-100",
  },
};


const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        if (response?.data?.job === null) {
          navigate("/dashboard/jobs");
          return;
        }
        setJobData(response?.data?.job);
      } catch (error) {
        console.error("Error fetching job:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const [newNote, setNewNote] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [statusDate, setStatusDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAutoResumeDialogOpen, setIsAutoResumeDialogOpen] = useState(false);
  const [isAutoCoverletterDialogOpen, setIsAutoCoverletterDialogOpen] = useState(false);

  const updateJobDataApi = async (updatedData: Partial<Job>) => {
    try {
      if (!id) return false;
      await axiosInstance.patch(`/jobs/${id}`, { job: updatedData });
      return true;
    } catch (error) {
      console.error("Error updating job data:", error);
      return false;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const status = newStatus as Status;
    if (status === jobData?.status) return;
    setPendingStatus(status);
    setStatusNote("");
    setStatusDate(new Date().toISOString().split("T")[0]);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus || !jobData) return;

    const newEntry: TimelineEntry = {
      status: pendingStatus,
      note: statusNote || "Status updated",
      date: new Date(statusDate).toISOString(),
    };

    const updatedTimeline = [newEntry, ...jobData.timeline];

    // Store previous state for potential rollback
    const previousJobData = { ...jobData };

    // Update local state optimistically
    setJobData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: pendingStatus,
        timeline: updatedTimeline,
      };
    });

    setIsStatusModalOpen(false);
    setPendingStatus(null);

    const success = await updateJobDataApi({
      status: pendingStatus,
      timeline: updatedTimeline,
    });

    if (!success) {
      // Revert to previous state
      setJobData(previousJobData);
      toast.error("Failed to update status", {
        position: "top-right",
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !jobData) return;

    const updatedNotes = [...jobData.notes, newNote];

    const previousJobData = { ...jobData };
    // Update local state
    setJobData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: updatedNotes,
      };
    });
    setNewNote("");

    const success = await updateJobDataApi({
      notes: updatedNotes,
    });
    if (!success) {
      setJobData(previousJobData);
      toast.error("Failed to add note", {
        position: "top-right",
      });
    }


  };

  const handleRemoveNote = async (index: number) => {
    if (!jobData) return;
    const updatedNotes = jobData.notes.filter((_, i) => i !== index);
    const previousJobData = { ...jobData };
    setJobData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: updatedNotes,
      };
    });
    const success = await updateJobDataApi({
      notes: updatedNotes,
    });
    if (!success) {
      setJobData(previousJobData);
      toast.error("Failed to remove note", {
        position: "top-right",
      });
    }

  };

  const handleRemoveTimelineEntry = async (index: number) => {
    if (!jobData) return;

    const updatedTimeline = jobData.timeline.filter((_, i) => i !== index);
    const previousJobData = { ...jobData };
    setJobData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        timeline: updatedTimeline,
      };
    });
    const success = await updateJobDataApi({
      timeline: updatedTimeline,
    });
    if (!success) {
      setJobData(previousJobData);
      toast.error("Failed to remove timeline entry", {
        position: "top-right",
      });
    }
  };

  const handleEditJob = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteJob = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed || !jobData?.id) return;

    try {
      await axiosInstance.delete(`/jobs/${jobData.id}`);
      navigate("/dashboard/jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job", {
        position: "top-right",
      });
    }
  };

  const changeResumeStatus = (status: "IDLE" | "GENERATING" | "COMPLETED" | "FAILED") => {
    if (!jobData) return;
    console.log("status", status);
    console.log("jobData", jobData);
    setJobData((prev: Job | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        resumeStatus: status,
      }
    });
  };

  const retryResumeGeneration = async () => {
    const resumeId = jobData?.resume?.documentId;
    if (!resumeId) {
      toast.error("Resume not found", {
        position: "top-right",
      });
      return;
    }
    try {
      const response = await axiosInstance.post(`/jobs/${jobData?.id}/retry-resume-generation`, {
        resumeId: resumeId,
      });
      changeResumeStatus(response.data.resumeStatus);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message.includes("Monthly limit reached")) {
          navigate("/dashboard/pricing");
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
          });
        }
      }
    }
  };


  const submitQuizToTailorResume = async (resumeId: string, questionsWithAnswers: QuestionWithAnswer[]) => {
    if (!resumeId || !questionsWithAnswers) return;
    try {
      const response = await axiosInstance.post(`/jobs/${jobData?.id}/tailor-resume`, {
        baseResumeId: resumeId,
        questionResponses: questionsWithAnswers,
      });
      setJobData(response.data.updatedJob);
    } catch (error) {
      changeResumeStatus("FAILED");
      console.error("Error generating resume questions:", error);
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message.includes("Monthly limit reached")) {
          navigate("/dashboard/pricing");
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
          });
        }
      }
    }
  };

  const submitQuizToTailorCoverLetter = async (resumeId: string, questionsWithAnswers: QuestionWithAnswer[]) => {
    if (!resumeId || !questionsWithAnswers) return;
    try {
      setIsCoverLetterLoading(true);
      const response = await axiosInstance.post(`/jobs/${jobData?.id}/tailor-cover-letter`, {
        name: jobData?.title + " Cover Letter" || "Cover Letter",
        resumeId: resumeId,
        jobDescription: jobData?.jobDescription || "",
        questionsWithAnswers: questionsWithAnswers,
        isTailoredCoverLetter: true
      });
      setJobData(response.data.updatedJob);
      setIsAutoCoverletterDialogOpen(false);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message.includes("Monthly limit reached")) {
          navigate("/dashboard/pricing");
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
          });
        }
      }
    } finally {
      setIsCoverLetterLoading(false);
    }
  };

  const { data: resumeStatus } = useQuery({
    queryKey: ['resumeStatus', jobData?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/jobs/${jobData?.id}/resume-status`);
      return response.data.resumeStatus;
    },
    enabled: !!jobData?.id && jobData?.resumeStatus === "GENERATING",
    refetchInterval: (data): number | false => {
      // Stop polling if completed or failed
      if (data?.state.dataUpdateCount > 20) {
        return false
      }
      if (data?.state.data?.resumeStatus === "COMPLETED" || data?.state.data?.resumeStatus === "FAILED") {
        return false;
      }
      return 3000;
    },
  });

  // Update your jobData when status changes
  useEffect(() => {
    if (resumeStatus) {
      console.log("resumeStatus", resumeStatus);
      setJobData((prev) => prev ? { ...prev, resumeStatus } : prev);
    }
  }, [resumeStatus]);

  if (isLoading) return <JobDetailsSkeleton />;

  if (isError || !jobData) {
    return (
      <JobDetailsError
        onRetry={() => {
          setIsError(false);
          if (id) {
            const fetchJob = async () => {
              setIsLoading(true);
              try {
                const response = await axiosInstance.get(`/jobs/${id}`);
                if (response?.data?.job === null) {
                  navigate("/dashboard/jobs");
                  return;
                }
                setJobData(response?.data?.job);
                setIsError(false);
              } catch (error) {
                console.error("Error fetching job:", error);
                setIsError(true);
              } finally {
                setIsLoading(false);
              }
            };
            fetchJob();
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Status Change Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogPortal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
          >
            <div className="flex flex-col max-h-[90vh] overflow-hidden bg-white shadow-xl rounded-lg border border-slate-200">
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 z-10">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>

              <DialogHeader className="px-6 pt-6 pb-3 flex-shrink-0 border-b border-slate-100">
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  Update Status
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Update the status of this job application
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Scrollable Content */}
                <div className="flex-1 flex flex-col min-h-0 px-6 py-5 overflow-y-auto">
                  {pendingStatus && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-500">From</span>
                        <span className="font-medium text-slate-900">
                          {STATUS_CONFIG[jobData?.status as Status]?.label}
                        </span>
                        <span className="text-slate-300">→</span>
                        <span className="font-medium text-slate-900">
                          {STATUS_CONFIG[pendingStatus].label}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="date"
                            value={statusDate}
                            onChange={(e) => setStatusDate(e.target.value)}
                            className="w-full pl-10 h-10 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Note (Optional)
                        </label>
                        <textarea
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          placeholder="Add context or details..."
                          className="w-full h-24 p-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-400 transition-colors resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Fixed Footer */}
                <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 bg-white flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsStatusModalOpen(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmStatusChange}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    size="sm"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>

      {/* Edit Job Modal */}
      <TrackJobFormEdit
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        job={jobData}
      />

      {/* Auto Resume Dialog */}
      <AutoResumeDialog
        open={isAutoResumeDialogOpen}
        onOpenChange={setIsAutoResumeDialogOpen}
        jobTitle={jobData?.title || ""}
        jobId={jobData?.id || ""}
        resumeId={jobData?.resume?.documentId || ""}
        questions={jobData?.resumeQuestions || []}
        submitQuizToTailorResume={submitQuizToTailorResume}
      />

      {/* Auto Cover Letter Dialog */}
      <AutoCoverletterDialog
        open={isAutoCoverletterDialogOpen}
        onOpenChange={setIsAutoCoverletterDialogOpen}
        jobTitle={jobData?.title || ""}
        jobId={jobData?.id || ""}
        resumeId={jobData?.resume?.documentId || ""}
        submitQuizToTailorCoverLetter={submitQuizToTailorCoverLetter}
        isCoverLetterLoading={isCoverLetterLoading}
      />

      {/* Job Info Card */}
      <div className="mx-auto max-w-7xl px-6 bg-white pt-10">
        <div className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Company Icon */}
              <div className="shrink-0">
                {jobData?.companyUrl ? (
                  <img
                    src={getFaviconUrl(jobData?.companyUrl) || ""}
                    alt={jobData?.companyName}
                    className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-slate-900 mb-1.5">
                  {jobData?.title}
                </h1>
                <div className="flex leading-relaxed flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-600">
                  <span className="font-medium">{jobData?.companyName}</span>
                  {jobData?.jobType && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4" />
                        {jobData.jobType}
                      </span>
                    </>
                  )}
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {jobData?.location}
                  </span>
                  {jobData?.jobUrl && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                      <button
                        onClick={() => window.open(jobData?.jobUrl, "_blank")}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Posting
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Select value={jobData?.status} onValueChange={handleStatusChange}>
                <SelectTrigger
                  className={cn(
                    "h-9 w-auto min-w-[140px] text-sm font-medium border-0 shadow-none bg-white hover:bg-slate-50 transition-colors",
                    STATUS_CONFIG[jobData?.status as Status]?.color
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                    <SelectItem key={value} value={value} className="text-sm">
                      <span className="flex items-center gap-2">
                        <config.icon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 border-0 shadow-none bg-white hover:bg-slate-50"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleEditJob}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Job
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteJob}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Job
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Documents Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-slate-700" />
                <h3 className="text-base font-semibold text-slate-900">
                  Documents
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Resume Card */}
                {jobData?.resume && jobData?.resumeStatus !== "IDLE" ? (
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:border-slate-300 hover:bg-slate-100 transition-all duration-200">
                    <div className="space-y-3 text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {jobData.resume.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Resume
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {jobData?.resumeStatus === "COMPLETED" && (
                          <Link
                            to={`/dashboard/resume/${jobData.resume.documentId}`}
                            target="_blank"
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-slate-300 bg-white hover:bg-slate-50"
                            >
                              <ExternalLink className="h-3 w-3 mr-1.5" />
                              View Resume
                            </Button>
                          </Link>
                        )}

                        {jobData?.resumeStatus === "FAILED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-red-200 bg-white text-red-600 hover:bg-red-50"
                            onClick={retryResumeGeneration}
                          >
                            <RefreshCw className="h-3 w-3 mr-1.5" />
                            Try Again
                          </Button>
                        )}

                        {jobData?.resumeStatus === "GENERATING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-300 bg-white hover:bg-slate-50"
                            disabled
                          >
                            <Loader2 className="h-3 w-3  animate-spin" />
                            Generating
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 cursor-pointer" onClick={() => setIsAutoResumeDialogOpen(true)}>
                    <div className="space-y-3 text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          Create Tailored Resume
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Tailored for this role
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAutoResumeDialogOpen(true);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                )}
                {/* Cover Letter Card */}
                {jobData?.coverLetter ? (
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:border-slate-300 hover:bg-slate-100 transition-all duration-200">
                    <div className="space-y-3 text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900">
                        <PenSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {jobData.coverLetter.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Cover Letter
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/cover-letter/${jobData.coverLetter.documentId}`}
                            target="_blank"
                            className="w-full"
                          >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-300 bg-white hover:bg-slate-50"
                          >
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            View Cover Letter
                          </Button>
                          </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 cursor-pointer" onClick={() => setIsAutoCoverletterDialogOpen(true)}>
                    <div className="space-y-3 text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                        <PenSquare className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          Create Tailored Cover Letter
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Personalized for this role
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAutoCoverletterDialogOpen(true);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Notes Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-700" />
                <h3 className="text-base font-semibold text-slate-900">
                  Notes
                </h3>
              </div>

              <div className="relative">
                <textarea
                  placeholder="Take a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  rows={3}
                  className="w-full p-3 pr-10 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 bg-slate-50 resize-none text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  size="sm"
                  className="absolute bottom-[30%] right-2 h-7 w-7 p-0 bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-md shadow-sm"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>

              {jobData?.notes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">
                    Notes you add appear here
                  </p>
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
                  {jobData?.notes.map((note: string, index: number) => {
                    // Simple 3-color palette
                    const colors = [
                      'bg-amber-100 border-amber-200 hover:bg-amber-50',
                      'bg-blue-100 border-blue-200 hover:bg-blue-50',
                      'bg-green-100 border-green-200 hover:bg-green-50',
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <div
                        key={index}
                        className={cn(
                          "group relative rounded-lg border p-4 transition-all duration-200 cursor-pointer break-inside-avoid mb-3",
                          colorClass
                        )}
                      >
                        <p className="text-sm text-slate-800 leading-relaxed break-words whitespace-pre-wrap">
                          {note}
                        </p>
                        <button
                          onClick={() => handleRemoveNote(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/60 text-slate-600 transition-all"
                          title="Delete note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Job Description Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-slate-700" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Description
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="h-auto text-xs text-slate-500 hover:text-slate-900 p-0"
                >
                  {isDescriptionExpanded ? "Collapse" : "Expand"}
                </Button>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                {isDescriptionExpanded ? (
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {jobData?.jobDescription}
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 leading-relaxed line-clamp-4">
                    {jobData?.jobDescription}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-1">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-700" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Timeline
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {jobData?.timeline.map(
                  (entry: TimelineEntry, index: number) => {
                    const config = STATUS_CONFIG[entry.status as Status];
                    const StatusIcon = config.icon;
                    const isLatest = index === 0;

                    return (
                      <div key={index} className="group relative pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex gap-3 items-center">
                          {/* Icon */}
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                              isLatest
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-400"
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  isLatest ? "text-slate-900" : "text-slate-600"
                                )}
                              >
                                {config.label}
                                <span className="text-xs font-normal text-slate-500 ml-2 mb-1">
                                  {new Date(entry.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </span>
                              {jobData?.timeline?.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTimelineEntry(index);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-600 rounded"
                                  title="Remove entry"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            {entry.note && (
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {entry.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpaceDetails;
