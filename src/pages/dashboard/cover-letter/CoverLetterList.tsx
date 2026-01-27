import { useState, useEffect } from "react";
import {
  MoreVertical,
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
import type { QuestionWithAnswer } from "../jobs/components/Quiz";

interface CoverLetter {
  id: number;
  title: string;
  createdAt: string;
  bgColor?: string;
  isTailoredCoverLetter: boolean;
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

  const coverLetters = coverLetterData?.data?.coverLetters.filter((coverLetter: CoverLetter) => coverLetter.isTailoredCoverLetter === false) || [];
  
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
      jobDescription: string;
      resumeData: string;
      questionsWithAnswers: QuestionWithAnswer[];
    }) => {
      const response = await axiosInstance.post("/cover-letter", data);
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Cover Letters</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create, manage, and customize your professional cover letters
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-200 p-6 h-[200px] flex flex-col justify-between"
              >
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2 mt-auto">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-red-50 p-3 mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">Failed to load cover letters</h3>
            <p className="text-xs text-slate-500 mb-4">There was an error loading your cover letters</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()} 
              className="text-slate-700 border-slate-200 hover:bg-slate-50"
            >
              Try again
            </Button>
          </div>
        )}

        {/* Cover Letter List */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* New Cover Letter Card */}
            <div
              onClick={() => setIsDialogOpen(true)}
              className="group relative cursor-pointer rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[200px] hover:bg-slate-50/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <Plus className="h-6 w-6 text-slate-600" />
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
                  Create New
                </h3>
              </div>
              <div className="mt-auto">
                <p className="text-sm text-slate-600 font-medium">
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
                  className="group relative rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[200px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">📄</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/40 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200"
                          aria-label="More"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-44 p-1 border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleRename(coverLetter);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(coverLetter);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
                      {coverLetter.title}
                    </h3>
                  </div>

                  <div className="mt-auto">
                    <p className="text-sm text-slate-600 font-medium">
                      {new Date(coverLetter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
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
