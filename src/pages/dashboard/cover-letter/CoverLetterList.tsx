import { useState, useEffect } from "react";
import {
  MoreVertical,
  FileText,
  Pencil,
  Trash2,
  Plus,
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
  
  // Sort by date (newest first)
  const sortedCoverLetters = [...coverLetters].sort((a: CoverLetter, b: CoverLetter) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">My Cover Letters</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create, manage, and customize your professional cover letters
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {/* Cover Letter List Skeletons */}

            <div
              onClick={() => setIsDialogOpen(true)}
              className="group relative cursor-pointer rounded-lg bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all duration-200 p-4 flex items-center gap-4 hover:bg-slate-50/50"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors flex-shrink-0">
                <Plus className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900">
                  Create New Cover Letter
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Start writing your cover letter
                </p>
              </div>
            </div>

            
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white border border-slate-200 p-4 flex items-center gap-4"
              >
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
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
              <div className="mb-6">
                <h3 className="font-semibold text-2xl text-slate-900 line-clamp-2 leading-tight mb-2">
                  Unable to load cover letters
                </h3>
                <p className="text-slate-600 font-medium">
                  There was an error loading your cover letters
                </p>
              </div>
              <div className="mt-auto">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-white/90 backdrop-blur-sm border border-white/30 hover:bg-white text-slate-700 hover:text-slate-900 font-medium"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cover Letter List */}
        {!isLoading && (
          <div className="space-y-3">
            {/* New Cover Letter Card */}
            <div
              onClick={() => setIsDialogOpen(true)}
              className="group relative cursor-pointer rounded-lg bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all duration-200 p-4 flex items-center gap-4 hover:bg-slate-50/50"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors flex-shrink-0">
                <Plus className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900">
                  Create New Cover Letter
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Start writing your cover letter
                </p>
              </div>
            </div>

            {/* Cover Letters */}
            {sortedCoverLetters.length > 0 &&
              sortedCoverLetters.map((coverLetter: CoverLetter) => (
                <Link
                  key={coverLetter.id}
                  to={`/dashboard/cover-letter/${coverLetter.id}`}
                  className="group relative rounded-lg bg-white border border-slate-200 transition-all duration-200 p-4 flex items-center gap-4 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div
                    style={{ backgroundColor: coverLetter.bgColor || "#f1f5f9" }}
                    className="h-10 w-10 rounded-lg flex items-center justify-center border border-slate-200 flex-shrink-0"
                  >
                    <FileText className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">
                      {coverLetter.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Created {new Date(coverLetter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          handleRename(coverLetter);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(coverLetter);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Link>
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
    </div>
  );
}
