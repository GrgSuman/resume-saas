import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import TrackJobForm from "./TrackJobForm";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import type { Job } from "../types/jobs";
import JobListCard from "./JobListCard";
import axiosInstance from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";

const TABS = [
  { value: "All", label: "All" },
  { value: "Saved", label: "Saved" },
  { value: "Applied", label: "Applied" },
  { value: "Interviewing", label: "Interviewing" },
  { value: "Offer", label: "Offer" },
  { value: "Archived", label: "Archived" },
  { value: "Rejected", label: "Rejected" },
] as const;

const JobSpace = () => {
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => axiosInstance.get("/jobs/"),
  });

  const allJobs = useMemo(() => {
    return (jobs?.data?.jobs || []) as Job[];
  }, [jobs]);

  const hasNoJobs = !isLoading && !isError && allJobs.length === 0;

  const filteredJobs = useMemo(() => {
    if (!jobs || allJobs.length === 0) return [];
    if (activeTab === "All") return allJobs;
    return allJobs.filter((job: Job) => job.status === activeTab);
  }, [activeTab, jobs, allJobs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Job Space
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create, manage, and track your job applications
          </p>
        </div>

        <TrackJobForm open={isTrackOpen} onOpenChange={setIsTrackOpen} />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-100 p-1 rounded-md inline-flex overflow-x-auto max-w-full">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {TABS.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-0 focus-visible:ring-0"
            >
              <div className="min-h-[400px] space-y-3">
                {/* Track New Job Card - Always show */}
                {activeTab === "All" && !hasNoJobs && (
                  <div
                    onClick={() => setIsTrackOpen(true)}
                    className="group flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Plus className="h-5 w-5 text-slate-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-slate-950">
                        Track New Job
                      </h3>
                      <p className="text-slate-600 text-xs mt-1">
                        Add a new job application
                      </p>
                    </div>
                  </div>
                )}

                {isLoading ? (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white"
                      >
                        <div className="flex-shrink-0">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-1" />
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-1 hidden sm:block" />
                            <Skeleton className="h-3 w-16 hidden sm:block" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="hidden sm:block">
                            <Skeleton className="h-5 w-20" />
                          </div>
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : isError ? (
                  <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
                    <div className="rounded-full bg-red-50 p-3 mb-4">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1">
                      Failed to load jobs
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      There was an error loading your job applications
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-slate-700 border-slate-200 hover:bg-slate-50"
                    >
                      Try again
                    </Button>
                  </div>
                ) : hasNoJobs && activeTab === "All" ? (
                  <div className="space-y-3">
                    <div
                      onClick={() => setIsTrackOpen(true)}
                      className="group relative overflow-hidden flex items-center gap-4 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50/50 hover:border-slate-400 hover:from-white hover:to-slate-100/50 cursor-pointer transition-all"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                          <Plus className="h-6 w-6 text-slate-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-base group-hover:text-slate-950 mb-1">
                          Track your first job
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Add a job application, tailor your resume and cover letter to match the role, then start tracking your progress.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {filteredJobs.length === 0 ? (
                      <div className="py-20 text-center rounded-lg border border-slate-200 bg-white">
                        <p className="text-slate-500 text-sm">
                          No jobs found matching your filter.
                        </p>
                      </div>
                    ) : (
                      filteredJobs.map((job: Job) => (
                        <JobListCard key={job.id} job={job} />
                      ))
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default JobSpace;
