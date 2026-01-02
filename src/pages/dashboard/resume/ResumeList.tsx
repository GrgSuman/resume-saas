import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import ResumeCardUI from "./ResumeCardUI";
import { toast } from "react-toastify";
import axios from "axios";
import NewResumeDialog from "./NewResumeDialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";

const ResumeList = () => {
  const [isNewResumeOpen, setIsNewResumeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "tailored">("main");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: resumeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/"),
  });

  // Separate resumes into Main and Tailored
  // Adjust the condition based on your API response structure
  // Check for: jobId, jobSpaceId, isTailored, or any field that indicates it's from job space
  const { mainResumes, tailoredResumes } = useMemo(() => {
    const allResumes = resumeData?.data?.resumes || [];
    const main: typeof allResumes = [];
    const tailored: typeof allResumes = [];

    allResumes.forEach(
      (resume: {
        id: string;
        title: string;
        createdAt: string;
        bgColor: string;
        emoji: string;
        jobId?: string; // Uncomment if your API returns this
        jobSpaceId?: string; // Uncomment if your API returns this
        isTailored?: boolean; // Uncomment if your API returns this
      }) => {
        // Adjust this condition based on your actual API response
        // Option 1: Check for jobId/jobSpaceId (most common)
        const isTailored = resume.jobId || resume.jobSpaceId;

        // Option 2: Check for isTailored flag
        // const isTailored = resume.isTailored === true;

        if (isTailored) {
          tailored.push(resume);
        } else {
          main.push(resume);
        }
      }
    );

    // Sort by date (newest first)
    const sortByDate = (a: (typeof allResumes)[0], b: (typeof allResumes)[0]) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    return {
      mainResumes: main.sort(sortByDate),
      tailoredResumes: tailored.sort(sortByDate),
    };
  }, [resumeData]);

  // Open "New Resume" modal when asked via route state or query
  useEffect(() => {
    type LocationState = { openCreateModal?: boolean } | null;
    const openByState =
      (location.state as LocationState)?.openCreateModal === true;
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
  }, [
    location.state,
    location.pathname,
    searchParams,
    setSearchParams,
    navigate,
  ]);

  // Create new resume mutation
  const createResumeMutation = useMutation({
    mutationFn: async ({
      resumeName,
      jobTitle,
    }: {
      resumeName: string;
      jobTitle?: string;
    }) => {
      const response = await axiosInstance.post("/resume", {
        title: resumeName,
        jobTitle: jobTitle || "",
      });
      return response.data;
    },
    onSuccess: (data) => {
      // toast.success("Resume created successfully!");
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

  const handleCreateResume = (resumeName: string, jobTitle?: string) => {
    createResumeMutation.mutate({ resumeName, jobTitle });
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            My Resumes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
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

        {/* Resume Tabs */}
        {!isLoading && (
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "main" | "tailored")
            }
            className="space-y-5"
          >
            {/* Tabs Navigation */}
            <TabsList className="bg-slate-100 p-1 rounded-md inline-flex">
              <TabsTrigger
                value="main"
                className="text-base px-4 py-2.5 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Main Resume
              </TabsTrigger>
              <TabsTrigger
                value="tailored"
                className="text-base px-4 py-2.5 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Tailored Resume
              </TabsTrigger>
            </TabsList>

            {/* Main Resume Tab Content */}
            <TabsContent value="main" className="mt-0 focus-visible:ring-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* New Resume Card */}
                <div
                  onClick={() => setIsNewResumeOpen(true)}
                  className="group relative cursor-pointer rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[200px] hover:bg-slate-50/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Plus className="h-6 w-6 text-slate-600" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
                      Create New Resume
                    </h3>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-slate-600 font-medium">
                      Start building your resume
                    </p>
                  </div>
                </div>

                {/* Main Resumes */}
                {mainResumes.length > 0 &&
                  mainResumes.map(
                    (resume: {
                      id: string;
                      title: string;
                      createdAt: string;
                      bgColor: string;
                      emoji: string;
                    }) => (
                      <ResumeCardUI
                        key={resume.id}
                        resume={{
                          id: resume.id,
                          title: resume.title,
                          createdAt: resume.createdAt,
                          bgColor: resume.bgColor,
                          emoji: resume.emoji,
                        }}
                      />
                    )
                  )}
              </div>
            </TabsContent>

            {/* Tailored Resume Tab Content */}
            <TabsContent value="tailored" className="mt-0 focus-visible:ring-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tailoredResumes.length > 0 ? (
                  tailoredResumes.map(
                    (resume: {
                      id: string;
                      title: string;
                      createdAt: string;
                      bgColor: string;
                      emoji: string;
                    }) => (
                      <ResumeCardUI
                        key={resume.id}
                        resume={{
                          id: resume.id,
                          title: resume.title,
                          createdAt: resume.createdAt,
                          bgColor: resume.bgColor,
                          emoji: resume.emoji,
                        }}
                      />
                    )
                  )
                ) : (
                  <div className="col-span-full">
                    <div className="rounded-lg border border-slate-200 bg-white px-6 py-8">
                      <div className="flex max-w-lg">
                        {/* Content */}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            Job-tailored resumes will appear here
                          </p>

                          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                            This section shows resumes that are generated for
                            specific jobs. You can create them from{" "}
                            <span className="font-medium text-slate-700">
                              Job Space
                            </span>
                            or directly tailor a resume using the browser
                            extension.
                          </p>

                          {/* Action */}
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate("/dashboard/jobs")}
                              className="gap-1.5"
                            >
                              <Briefcase className="h-4 w-4" />
                              Go to Job Space
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* New Resume Form Modal */}
        <NewResumeDialog
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
