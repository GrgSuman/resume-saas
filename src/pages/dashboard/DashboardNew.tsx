import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Link } from "react-router";
import { ArrowUpRight, FileText, PenSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { formatRelativeTime } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";
// import { Video } from "lucide-react";

const DashboardNew = () => {
  const { user } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => axiosInstance.get("/dashboard"),
  });

  const dashboardData = data?.data;

  const summaryCards = [
    {
      title: "Resumes",
      count: dashboardData?.resumeCount || 0,
      description: "Last edited 2 days ago",
      action: "Go to resumes",
      href: "/dashboard/resume",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      icon: FileText,
    },
    {
      title: "Cover Letters",
      count: dashboardData?.coverLetterCount || 0,
      description: "Draft ready to personalize",
      action: "Go to cover letters",
      href: "/dashboard/cover-letter",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      icon: PenSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-foreground">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
          Your drafts are ready. Pick one and keep moving you're closer than you think.
          </p>
        </div>
        {/* <Button
          variant="default"
          onClick={() => setIsVideoOpen(true)}
          className="gap-2 bg-gray-900 hover:bg-black text-white"
        >
          <Video className="h-4 w-4" />
          How to use
        </Button> */}
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent
          className="sm:max-w-4xl p-0 border-0 bg-transparent shadow-none"
          showCloseButton={false}
        >
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How to use Resume Builder"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "RESUMES", iconBg: "bg-indigo-100", icon: FileText },
            { title: "COVER LETTERS", iconBg: "bg-amber-100", icon: PenSquare },
          ].map((card) => (
            <div
              key={card.title}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <div className="space-y-1">
                <p className="text-base font-medium uppercase text-slate-900">{card.title}</p>
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className={`h-12 w-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.title === "RESUMES" ? "text-indigo-600" : "text-amber-600"}`} />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-8">
            <p className="text-sm text-red-600">Failed to load dashboard data</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <div className="space-y-1">
                <p className="text-base font-medium uppercase text-slate-900">{card.title}</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {card.count}
                </p>
                <Link
                  to={card.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
                >
                  {card.action}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div
                className={`h-12 w-12 rounded-xl ${card.iconBg} flex items-center justify-center`}
              >
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium uppercase text-slate-900">
              Recently opened
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Continue where you left off
            </p>
          </div>
          {dashboardData?.latestItems && dashboardData.latestItems.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/dashboard/${dashboardData.latestItems[0]?.type === 'cover-letter' ? 'cover-letter' : 'resume'}`}>
                View all
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-4"
              >
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-4 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50/50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-red-700">Failed to load recent items</p>
          </div>
        ) : dashboardData?.latestItems && dashboardData.latestItems.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.latestItems.map((item: { title: string; type: string; updatedAt: string; id: string,bgColor: string }) => {
              const Icon = item.type === 'cover-letter' ? PenSquare : FileText;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white/70 p-3 sm:p-4 transition hover:border-slate-300 hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <Link
                    to={`/dashboard/${item.type === 'cover-letter' ? 'cover-letter' : 'resume'}/${item.id}`}
                    className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0"
                  >
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center flex-shrink-0 border border-white/60 "
                      style={{
                        backgroundColor: item.bgColor,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="capitalize">{item.type === 'cover-letter' ? 'Cover Letter' : 'Resume'}</span>
                        <span> last edited {formatRelativeTime(item.updatedAt)}</span>
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 sm:gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1.5 h-8 sm:h-9"
                    >
                      <Link to={`/dashboard/${item.type === 'cover-letter' ? 'cover-letter' : 'resume'}/${item.id}`}>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white/70 px-6 py-10 text-center">
            <div className="max-w-sm mx-auto space-y-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  No recent activity
                </p>
                <p className="text-xs text-slate-500">
                  Create your first resume or cover letter to get started
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNew;
