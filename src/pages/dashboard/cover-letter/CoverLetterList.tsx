import { useState, useEffect } from "react";
import {
  MoreVertical,
  FileText,
  Pencil,
  Trash2,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router";
import CoverLetterDialog from "./CoverLetterDialog";
import EditTitleModal from "./EditTitleModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../../components/ui/skeleton";
import { AxiosError } from "axios";

interface CoverLetter {
  id: number;
  title: string;
  createdAt: string;
  bgColor?: string;
}

export default function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {data: coverLetterData,isLoading,isError} = useQuery({
    queryKey: ["cover-letter"],
    queryFn: () => axiosInstance.get("/cover-letter/user"),
  });

  const coverLetters = coverLetterData?.data?.coverLetters || [];

  const queryClient = useQueryClient();

  // Open dialog when asked via route state
  useEffect(() => {
    type LocationState = { openCreateModal?: boolean } | null;
    const openByState =
      (location.state as LocationState)?.openCreateModal === true;
    if (openByState) {
      setIsDialogOpen(true);
      // Clean up state so refresh/back won't re-open unintentionally
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // Delete cover letter mutation
  const deleteCoverLetterMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/cover-letter/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cover-letter"] });
      toast.success("Cover letter deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete cover letter", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to delete cover letter", {
          position: "top-right",
        });
      }
    },
  });

  // Update cover letter title mutation
  const updateCoverLetterTitleMutation = useMutation({
    mutationFn: async ({ id, title }: { id: number; title: string }) => {
      const response = await axiosInstance.patch(`/cover-letter/${id}`, {
        name: title
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cover-letter"] });
      setIsEditModalOpen(false);
      setSelectedCoverLetter(null);
    },
    onError: (error: unknown) => {
      console.error(error);
        toast.error("Failed to update title", {
          position: "top-right",
        });
    },
  });

  // Create new resume mutation
  const createCoverLetterMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      resumeId: string;
      jobDescription: string;
      resumeFile?: File;
      personalization?: {
        excitement: string;
        achievement: string;
        tone: string;
      };
    }) => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("resumeId", data.resumeId);
      formData.append("jobDescription", data.jobDescription);
      
      // Append file if it exists
      if (data.resumeFile) {
        formData.append("resumeFile", data.resumeFile);
      }
      
      // Append personalization data as JSON string
      if (data.personalization) {
        formData.append("personalization", JSON.stringify({
          excitement: data.personalization.excitement || "",
          achievement: data.personalization.achievement || "",
          tone: data.personalization.tone || "",
        }));
      }

      const response = await axiosInstance.post("/cover-letter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cover-letter"] });

      setIsDialogOpen(false);
      navigate(`/dashboard/cover-letter/${data.coverLetter.id}`);
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong", {
        position: "top-right",
      });
    },
  });

  const handleDelete = (coverLetter: CoverLetter) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${coverLetter.title}"? This action cannot be undone.`
    );
    if (confirmed) {
      deleteCoverLetterMutation.mutate(coverLetter.id);
    }
  };

  const handleRename = (coverLetter: CoverLetter) => {
    setSelectedCoverLetter(coverLetter);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (newTitle: string) => {
    if (selectedCoverLetter) {
      updateCoverLetterTitleMutation.mutate({
        id: selectedCoverLetter.id,
        title: newTitle,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-medium text-foreground">
            My Cover Letters
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Create, manage, and customize your professional cover letters
          </p>
        </div>
        <Button
          className="gap-2 w-full sm:w-auto"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create New
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-row items-center gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white/70 p-3 sm:p-4"
            >
              <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
                <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-md flex-shrink-0" />
                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                  <Skeleton className="h-4 w-32 sm:w-40" />
                  <Skeleton className="h-3 w-24 sm:w-32" />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 flex flex-col h-[280px] w-[320px] bg-gradient-to-br from-red-500/20 to-rose-500/20">
            <div className="flex items-start justify-center mb-6">
              <span className="text-6xl">⚠️</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-2xl text-slate-900 line-clamp-2 leading-tight mb-2">
              Unable to load cover letters
            </h3>
          </div>

          <div className="mt-auto"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && coverLetters.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-500">
          {/* Icon Container */}
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 ring-8 ring-blue-50/50">
            <FileText className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
          </div>

          {/* Typography */}
          <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            Let's write your first letter
          </h3>
          <p className="text-slate-500 max-w-xs text-center mb-8 text-sm sm:text-base">
            Stand out from the crowd with a personalized cover letter tailored
            to your dream job.
          </p>

          {/* Button */}
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="">
            <Plus className="w-5 h-5" />
            Start Writing
          </Button>
        </div>
      )}
      {/* List */}
      {!isLoading && !isError && coverLetters.length > 0 && (
        <div className="space-y-3">
          {coverLetters.map((coverLetter: CoverLetter) => (
            <div
              key={coverLetter.id}
              className="flex flex-row items-center gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white/70 p-3 sm:p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <Link
                to={`/dashboard/cover-letter/${coverLetter.id}`}
                className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center flex-shrink-0 border border-white/60 shadow-sm"
                  style={{
                    backgroundColor: coverLetter.bgColor,
                  }}
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
                </div>
                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {coverLetter.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Created on{" "}
                    <span className="font-medium text-slate-600">
                      {new Date(coverLetter.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-1.5 h-8 sm:h-9"
                >
                  <Link to={`/dashboard/cover-letter/${coverLetter.id}`}>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => handleRename(coverLetter)}>
                      <Pencil className="w-4 h-4 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(coverLetter)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cover Letter Dialog */}
      <CoverLetterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(data) => {
          createCoverLetterMutation.mutate(data);
        }}
        isCreating={createCoverLetterMutation.isPending}
      />

      {/* Edit Title Modal */}
      {selectedCoverLetter && (
        <EditTitleModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleEditSubmit}
          currentTitle={selectedCoverLetter.title}
          isLoading={updateCoverLetterTitleMutation.isPending}
        />
      )}
    </div>
  );
}
