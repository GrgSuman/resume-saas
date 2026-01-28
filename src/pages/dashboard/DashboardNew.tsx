import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Link } from "react-router";
import { ArrowUpRight, FileText, PenSquare, Plus, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { formatRelativeTime } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";
import { useNavigate } from "react-router";

const DashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => axiosInstance.get("/auth/dashboard"),
  });

  const dashboardData = data?.data;

  const summaryCards = [
    {
      title: "Tailored Applications",
      count: dashboardData?.applicationsCount || 0,
      href: "/dashboard/jobs",
      icon: Sparkles,
    },
    {
      title: "Resumes",
      count: dashboardData?.resumeCount || 0,
      href: "/dashboard/resume",
      icon: FileText,
    },
    {
      title: "Cover Letters",
      count: dashboardData?.coverLetterCount || 0,
      href: "/dashboard/cover-letter",
      icon: PenSquare,
    }
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your resumes and cover letters
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-7 w-16" />
              </div>
            ))}
          </>
        ) : (
          summaryCards.map((card) => (
            <Link
              key={card.title}
              to={card.href}
              className="group rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {card.count}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <card.icon className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Recent Documents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent documents
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Your latest work
            </p>
          </div>
          {dashboardData?.latestItems?.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/resume">
                View all
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
              >
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            Failed to load recent documents.
          </div>
        ) : dashboardData?.latestItems?.length > 0 ? (
          <div className="bg-white">
            {dashboardData.latestItems.map(
              (item: {
                id: string;
                title: string;
                type: string;
                updatedAt: string;
                bgColor: string;
              }) => {
                const Icon =
                  item.type === "cover-letter" ? PenSquare : FileText;

                return (
                  <Link
                    key={item.id}
                    to={`/dashboard/${
                      item.type === "cover-letter"
                        ? "cover-letter"
                        : "resume"
                    }/${item.id}`}
                    className="flex items-center justify-between py-5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="h-10 w-10 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <Icon className="h-4 w-4 text-slate-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.type === "cover-letter"
                            ? "Cover letter"
                            : "Resume"}{" "}
                          · {formatRelativeTime(item.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0 ml-2" />
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="px-8 py-20 text-center">
                <div className="mx-auto max-w-sm space-y-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50">
                    <FileText className="h-7 w-7 text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                      No documents yet
                    </h3>
                    <p className="text-sm text-slate-600">
                      Get started by creating your first resume or cover letter.
                    </p>
                  </div>
                  <div className="pt-1">
                    <Button
                      size="default"
                      onClick={() =>
                        navigate("/dashboard/resume", {
                          state: { openCreateModal: true },
                        })
                      }
                      className="group"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Resume
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardNew;
