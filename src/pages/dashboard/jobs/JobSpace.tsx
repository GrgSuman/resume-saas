import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import StartApplication from "./components/StartApplication";

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
            Tailored Applications
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Tailor resumes and cover letters for any job and track your applications
          </p>
        </div>

        <StartApplication open={isTrackOpen} onOpenChange={setIsTrackOpen}/>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="space-y-5"
        >
          <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="bg-slate-100 p-1 rounded-md inline-flex">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm flex-shrink-0"
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
              <div className="min-h-[400px]">
                {isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border p-6 h-[200px] bg-white"
                      >
                        <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="mt-auto">
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div
                      onClick={() => setIsTrackOpen(true)}
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
                          Create tailored application
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
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* New Application Card - Always First in "All" Tab */}
                        {activeTab === "All" && (
                          <div
                            onClick={() => setIsTrackOpen(true)}
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
                                Create tailored application
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Job Cards */}
                        {filteredJobs.map((job: Job) => (
                          <JobListCard key={job.id} job={job} />
                        ))}
                      </div>
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
