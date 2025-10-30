import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import NewResumeForm from "./NewResumeForm";
import ResumeCardUI from "./ResumeCardUI";
import { toast } from "react-toastify";
import axios from "axios";
// import { useAuth } from "../../../hooks/useAuth";

const ResumeList = () => {
  const [isNewResumeOpen, setIsNewResumeOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // const { deductCredits } = useAuth();

  const {
    data: resumeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/user"),
  });

  const resumes = resumeData?.data?.resume || [];

  // Open "New Resume" modal when asked via route state or query
  useEffect(() => {
    type LocationState = { openCreateModal?: boolean } | null;
    const openByState = ((location.state as LocationState)?.openCreateModal) === true;
    const openByQuery = searchParams.get("modal") === "new";
    const shouldOpen = openByState || openByQuery;
    if (shouldOpen) {
      setIsNewResumeOpen(true);
      // Clean up state so refresh/back won't re-open unintentionally
      if (openByState) {
        navigate(location.pathname, { replace: true });
      }
      if (openByQuery) {
        const next = new URLSearchParams(searchParams);
        next.delete("modal");
        setSearchParams(next, { replace: true });
      }
    }
  }, [location.state, location.pathname, searchParams, setSearchParams, navigate]);

  // Create new resume mutation
  const createResumeMutation = useMutation({
    mutationFn: async (resumeName: string) => {
      const response = await axiosInstance.post("/resume", {
        title: resumeName,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Resume created successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      // deductCredits("CREATE_RESUME");
      setIsNewResumeOpen(false);
      navigate(`/dashboard/resume/${data.resume.id}`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message === "Insufficient credits") {
          toast.info("Insufficient credits, Click to Buy credits", {
            onClick: () => {
              navigate("/dashboard/credits");
            },
          });
        } else {
          toast.error(error.response?.data?.message || "Something went wrong", {
            position: "top-right",
          });
        }
      }
    },
  });

  const handleCreateResume = (resumeName: string) => {
    createResumeMutation.mutate(resumeName);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className=" mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-foreground">My Resumes</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and customize your professional resumes
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-white border border-slate-200 transition-all duration-300 p-6 flex flex-col h-[220px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>

                {/* Title */}
                <div className="mb-4">
                  <Skeleton className="h-6 w-3/4" />
                </div>

                {/* Date Info */}
                <div className="mt-auto">
                  <Skeleton className="h-4 w-1/2" />
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

              {/* Title */}
              <div className="mb-6">
                <h3 className="font-semibold text-2xl text-slate-900 line-clamp-2 leading-tight mb-2">
                  Unable to load resumes
                </h3>
                <p className="text-slate-600 font-medium">
                  There was an error loading your resumes
                </p>
              </div>

              {/* CTA Button */}
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

        {/* Empty State */}
        {!isLoading && !isError && resumes.length === 0 && (
          <div className="w-[360px] h-[220px]">
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-8">
              <div className="flex flex-col">
                {/* Icon */}
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
                    <Plus className="h-6 w-6 text-slate-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="max-w-sm">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">
                    No resumes yet
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Create your first professional resume quickly and easily. You can edit or duplicate it anytime.
                  </p>

                  {/* CTA Button */}
                  <Button
                    onClick={() => setIsNewResumeOpen(true)}
                    size="sm"
                    className="px-6 py-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Resume
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Grid */}
        {!isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* New Resume */}

            {resumes.length !== 0 && (
              <div
                onClick={() => setIsNewResumeOpen(true)}
                className="group relative cursor-pointer rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[220px] hover:bg-slate-50/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Plus className="h-6 w-6 text-slate-600" />
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
                    Create New Resume
                  </h3>
                </div>

                {/* Date Info */}
                <div className="mt-auto">
                  <p className="text-sm text-slate-600 font-medium">
                    Start building your resume
                  </p>
                </div>
              </div>
            )}

            {/* Existing Resumes */}
            {resumes.length > 0 &&
              resumes.map(
                (resume: { id: string; title: string; updatedAt: string }) => (
                  <ResumeCardUI
                    key={resume.id}
                    resume={{
                      id: resume.id,
                      title: resume.title,
                      updatedAt: resume.updatedAt,
                    }}
                  />
                )
              )}
          </div>
        )}

        {/* New Resume Form Modal */}
        <NewResumeForm
          open={isNewResumeOpen}
          onOpenChange={setIsNewResumeOpen}
          onSubmit={handleCreateResume}
          isLoading={createResumeMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ResumeList;
