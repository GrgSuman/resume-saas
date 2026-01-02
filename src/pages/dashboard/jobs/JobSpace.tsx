import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ListFilter,
  Plus,
  LayoutList,
  Grid3x3,
  ExternalLink,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import TrackJobForm from "./TrackJobForm";

type Status = "applied" | "interviewing" | "rejected";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  statusType: Status;
  appliedAt: string;
};

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    status: "applied",
    statusType: "applied",
    appliedAt: "2021-01-01",
  },
  {
    id: "2",
    title: "Software Engineer",
    company: "Facebook",
    location: "Menlo Park, CA",
    status: "interviewing",
    statusType: "interviewing",
    appliedAt: "2021-01-01",
  },
];

const statusChip: Record<Status, { bg: string; text: string }> = {
  applied: { bg: "bg-blue-100", text: "text-blue-700" },
  interviewing: { bg: "bg-amber-100", text: "text-amber-700" },
  rejected: { bg: "bg-slate-100", text: "text-slate-600" },
};

const filterJobs = (status?: Status): Job[] =>
  status ? mockJobs.filter((j) => j.statusType === status) : mockJobs;

/* ------------------ VARIANT 1: COMPACT LIST ------------------ */

const JobListCompact = ({ jobs }: { jobs: Job[] }) => {
  const navigate = useNavigate();

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-8">
        <div className="flex max-w-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              No jobs tracked yet
            </p>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              Start tracking your job applications to create tailored resumes
              and cover letters. You can add jobs manually or use the{" "}
              <span className="font-medium text-slate-700">
                Chrome Extension
              </span>{" "}
              to quickly capture job postings.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/dashboard/jobs/new")}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Job Manually
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/dashboard/extension")}
                className="gap-1.5"
              >
                <ExternalLink className="h-4 w-4" />
                Get Extension
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => {
        const chipStyle = statusChip[job.statusType as Status];
        return (
          <button
            key={job.id}
            onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
            className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {job.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {job.company} · {job.location} · {job.appliedAt}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
                  chipStyle.bg,
                  chipStyle.text
                )}
              >
                {job.status}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

/* ------------------ VARIANT 2: CARD GRID ------------------ */

const JobListGrid = ({ jobs }: { jobs: Job[] }) => {
  const navigate = useNavigate();

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-8">
        <div className="flex max-w-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              No jobs tracked yet
            </p>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              Start tracking your job applications to create tailored resumes
              and cover letters. You can add jobs manually or use the{" "}
              <span className="font-medium text-slate-700">
                Chrome Extension
              </span>{" "}
              to quickly capture job postings.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/dashboard/jobs/new")}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Job Manually
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/dashboard/extension")}
                className="gap-1.5"
              >
                <ExternalLink className="h-4 w-4" />
                Get Extension
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => {
        const chipStyle = statusChip[job.statusType as Status];
        return (
          <button
            key={job.id}
            onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
            className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 flex-1">
                {job.title}
              </h3>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2 shrink-0",
                  chipStyle.bg,
                  chipStyle.text
                )}
              >
                {job.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">{job.company}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{job.location}</span>
              <span>·</span>
              <span>{job.appliedAt}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

/* ------------------ MAIN ------------------ */

const JobSpace = () => {
  const [variant, setVariant] = useState<"compact" | "grid">("compact");
  const [activeTab, setActiveTab] = useState("all");
  const [isTrackJobOpen, setIsTrackJobOpen] = useState(false);

  const counts = {
    all: mockJobs.length,
    applied: filterJobs("applied").length,
    interviewing: filterJobs("interviewing").length,
    archive: filterJobs("rejected").length,
  };

  const currentCount = counts[activeTab as keyof typeof counts] || counts.all;

  const renderJobList = (jobs: Job[]) => {
    switch (variant) {
      case "compact":
        return <JobListCompact jobs={jobs} />;
      case "grid":
        return <JobListGrid jobs={jobs} />;
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">
              Job Space
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track jobs, tailor resumes, capture notes, and prep for
              interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-0.5">
              <button
                onClick={() => setVariant("compact")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  variant === "compact"
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
                title="List View"
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVariant("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  variant === "grid"
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
                title="Grid View"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="sm"
              className="hidden sm:inline-flex gap-1.5"
              onClick={() => setIsTrackJobOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Track Job
            </Button>
          </div>
        </div>

        <TrackJobForm open={isTrackJobOpen} onOpenChange={setIsTrackJobOpen} />

        {/* Tabs + Sort */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <TabsList className="bg-slate-100 p-1 rounded-md inline-flex w-auto">
                {[
                  ["all", "All"],
                  ["applied", "Applied"],
                  ["interviewing", "Interviewing"],
                  ["archive", "Archive"],
                ].map(([value, label]) => (
                  <TabsTrigger
                    key={value}
                    value={value as string}
                    className="text-sm px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex items-center gap-2">
              {/* Total count */}
              <span className="text-sm font-bold text-slate-700">
                Total: {currentCount}
              </span>

              {/* Sort icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className=" bg-white p-2 text-slate-500 hover:bg-slate-50">
                    <ListFilter className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Newest first</DropdownMenuItem>
                  <DropdownMenuItem>Oldest first</DropdownMenuItem>
                  <DropdownMenuItem>Job title (A–Z)</DropdownMenuItem>
                  <DropdownMenuItem>Company (A–Z)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all">{renderJobList(mockJobs)}</TabsContent>
          <TabsContent value="applied">
            {renderJobList(filterJobs("applied"))}
          </TabsContent>
          <TabsContent value="interviewing">
            {renderJobList(filterJobs("interviewing"))}
          </TabsContent>
          <TabsContent value="archive">
            {renderJobList(filterJobs("rejected"))}
          </TabsContent>
        </Tabs>

        {/* Mobile CTA */}
        <div className="sm:hidden fixed bottom-4 inset-x-4">
          <Button
            className="w-full gap-2"
            onClick={() => setIsTrackJobOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Track New Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobSpace;
