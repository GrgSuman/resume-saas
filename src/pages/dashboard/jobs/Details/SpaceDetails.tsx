import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { SelectContent } from "../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  FileText,
  PenSquare,
  Plus,
  Clock,
  CheckCircle2,
  Archive,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Briefcase,
  Bookmark,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { Job, Status, TimelineEntry } from "../../types/jobs";
import axiosInstance from "../../../../api/axios";
import { toast } from "react-toastify";
import TrackJobFormEdit from "./TrackJobFormEdit";
import JobDetailsSkeleton from "./JobDetailsSkeleton";
import JobDetailsError from "./JobDetailsError";
import AutoResumeDialog from "./AutoResumeDialog";
import AutoCoverletterDialog from "./AutoCoverletterDialog";

const STATUS_CONFIG: Record<
  Status,
  { label: string; icon: React.ElementType; color: string }
> = {
  Saved: {
    label: "Saved",
    icon: Bookmark,
    color: "text-zinc-600 bg-white border-zinc-200",
  },
  Applied: {
    label: "Applied",
    icon: CheckCircle2,
    color: "text-zinc-800 bg-zinc-50 border-zinc-300",
  },
  Interviewing: {
    label: "Interviewing",
    icon: Clock,
    color: "text-zinc-900 bg-zinc-100 border-zinc-400",
  },
  Offer: {
    label: "Offer",
    icon: CheckCircle2,
    color: "text-white bg-zinc-900 border-zinc-900",
  },
  Rejected: {
    label: "Rejected",
    icon: X,
    color: "text-zinc-400 bg-white border-zinc-200",
  },
  Archived: {
    label: "Archived",
    icon: Archive,
    color: "text-zinc-400 bg-white border-zinc-200",
  },
};

const getFaviconUrl = (companyUrl?: string): string | null => {
  if (!companyUrl) return null;
  const cleanDomain = companyUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
};

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        if(response?.data?.job===null){
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
      await axiosInstance.patch(`/jobs/${id}`, {job:updatedData});
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
      toast.success("Job deleted successfully", {
        position: "top-right",
      });
      navigate("/dashboard/jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job", {
        position: "top-right",
      });
    }
  };

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
      {isStatusModalOpen && pendingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200">
            <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="font-medium text-zinc-900">Update Status</h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-zinc-500">From</span>
                <span className="font-medium text-zinc-900">
                  {STATUS_CONFIG[jobData?.status as Status]?.label}
                </span>
                <span className="text-zinc-300">→</span>
                <span className="font-medium text-zinc-900">
                  {STATUS_CONFIG[pendingStatus].label}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="date"
                    value={statusDate}
                    onChange={(e) => setStatusDate(e.target.value)}
                    className="w-full pl-10 h-10 rounded-md border border-zinc-200 bg-white text-sm focus:outline-none focus:border-zinc-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Note (Optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add context or details..."
                  className="w-full h-24 p-3 rounded-md border border-zinc-200 bg-white text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
                className="border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmStatusChange}
                className="bg-zinc-900 text-white hover:bg-zinc-800"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

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
      />

      {/* Auto Cover Letter Dialog */}
      <AutoCoverletterDialog
        open={isAutoCoverletterDialogOpen}
        onOpenChange={setIsAutoCoverletterDialogOpen}
        jobTitle={jobData?.title || ""}
        jobId={jobData?.id || ""}
      />

      {/* Header */}
      <header className="border-b border-zinc-100">
        <div className="mx-auto px-6 py-6">
          <Link
            to="/dashboard/jobs"
            className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Company Icon */}
              <div className="shrink-0">
                {jobData?.companyUrl ? (
                  <img
                    src={getFaviconUrl(jobData?.companyUrl) || ""}
                    alt={jobData?.companyName}
                    className="h-12 w-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-zinc-400" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-xl font-medium text-zinc-900 mb-2">
                  {jobData?.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{jobData?.companyName}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {jobData?.location}
                  </span>
                  {jobData?.jobUrl && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <button
                        onClick={() => window.open(jobData?.jobUrl, "_blank")}
                        className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Posting
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={jobData?.status} onValueChange={handleStatusChange}>
                <SelectTrigger
                  className={cn(
                    "h-9 w-auto min-w-[140px] text-sm font-medium",
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
                    className="h-9 w-9 p-0 border-zinc-200"
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
      </header>

      {/* Main Content */}
      <main className="mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Documents Section */}
            <section className="space-y-6">
              <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-wider">
                Documents
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Resume Card */}
                {jobData?.resume ? (
                  <div className="group p-6 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors bg-white">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-zinc-900">
                          {jobData.resume.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Resume
                        </p>
                      </div>
                      <Link
                        to={`/dashboard/resume/${jobData.resume.documentId}`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-between border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        >
                          Edit Document
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-zinc-200 rounded-lg bg-zinc-50">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-zinc-200">
                        <FileText className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-zinc-900">
                          Create Resume
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Tailored for this role
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-zinc-200 text-zinc-700"
                        onClick={() => setIsAutoResumeDialogOpen(true)}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cover Letter Card */}
                {jobData?.coverLetter ? (
                  <div className="group p-6 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors bg-white">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900">
                        <PenSquare className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-zinc-900">
                          {jobData.coverLetter.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Cover Letter
                        </p>
                      </div>
                      <Link
                        to={`/dashboard/cover-letter/${jobData.coverLetter.documentId}`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-between border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        >
                          Edit Document
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-zinc-200 rounded-lg bg-zinc-50">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-zinc-200">
                        <PenSquare className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-zinc-900">
                          Create Cover Letter
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Personalized for this role
                        </p>
                      </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-zinc-200 text-zinc-700"
                          onClick={() => setIsAutoCoverletterDialogOpen(true)}
                        >
                          Get Started
                        </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-wider">
                  Timeline
                </h3>
                <span className="text-xs text-zinc-400">
                  {jobData?.timeline?.length || 0} updates
                </span>
              </div>

              <div className="relative space-y-8">
                {jobData?.timeline.map(
                  (entry: TimelineEntry, index: number) => {
                    const config = STATUS_CONFIG[entry.status as Status];
                    const StatusIcon = config.icon;
                    const isLatest = index === 0;

                    return (
                      <div key={index} className="group relative flex gap-6">
                        {/* Connector line */}
                        {index !== (jobData?.timeline?.length || 0) - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-px bg-zinc-200" />
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                            isLatest
                              ? "bg-zinc-900 text-white"
                              : "bg-white border-2 border-zinc-200 text-zinc-400"
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 -mt-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isLatest ? "text-zinc-900" : "text-zinc-500"
                              )}
                            >
                              {config.label}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {new Date(entry.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-sm text-zinc-600 leading-relaxed mt-2">
                              {entry.note}
                            </p>
                          )}
                        </div>

                        {/* Delete button */}
                        {jobData?.timeline?.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTimelineEntry(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-zinc-400 hover:text-red-600 rounded-md self-start"
                            title="Remove entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* Job Description Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-wider">
                  Description
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="h-auto text-xs text-zinc-500 hover:text-zinc-900 p-0"
                >
                  {isDescriptionExpanded ? "Collapse" : "Expand"}
                </Button>
              </div>

              <div className="border border-zinc-200 rounded-lg p-6 bg-white">
                {isDescriptionExpanded ? (
                  <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                    {jobData?.jobDescription}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-700 leading-relaxed line-clamp-4">
                    {jobData?.jobDescription}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Notes */}
          <div className="lg:col-span-1">
            <section className="space-y-6 lg:sticky lg:top-6">
              <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-wider">
                Notes
              </h3>

              <div className="relative">
                <Input
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  className="h-10 pr-10 border-zinc-200 focus:border-zinc-400"
                />
                <button
                  onClick={handleAddNote}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                >
                  <Plus className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                {jobData?.notes.map((note: string, index: number) => {
                  // Different colors for sticky notes
                  const colors = [
                    "bg-yellow-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
                    "bg-pink-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
                    "bg-blue-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
                    "bg-green-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
                    "bg-purple-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
                  ];
                  const rotations = [-1.5, 1, -0.5, 1.5, -1];
                  const colorClass = colors[index % colors.length];
                  const rotation = rotations[index % rotations.length];

                  return (
                    <div
                      key={index}
                      className={cn(
                        "group relative p-4 transition-all hover:scale-[1.02] hover:shadow-lg",
                        colorClass
                      )}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      <p className="text-sm text-zinc-800 leading-relaxed flex-1 font-medium">
                        {note}
                      </p>
                      <button
                        onClick={() => handleRemoveNote(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-600 hover:bg-red-100 rounded transition-all flex-shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
                {jobData?.notes.length === 0 && (
                  <p className="text-sm text-zinc-400 text-center py-8">
                    No notes yet
                  </p>
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
