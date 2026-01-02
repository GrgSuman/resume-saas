import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { SUBSCRIPTION_PLAN_LIMITS } from "../types/constants";
import { Link } from "react-router";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useState } from "react";
import SubscriptionLoadingSkeleton from "./SubscriptionLoadingSkeleton";

const MySubscription = () => {

  const [loadingManageSubscription, setLoadingManageSubscription] = useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["usage"],
    queryFn: () => axiosInstance.get("/auth/usage"),
  });

  if (isLoading) {
    return <SubscriptionLoadingSkeleton />;
  }

  if (isError || !data?.data?.userUsage) {
    return (
      <div className="min-h-screen bg-background p-6 sm:p-8 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-slate-600">Failed to load subscription data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const userPlan = data.data.userUsage.subscription?.plan;
  const usageData = data.data.userUsage.usage?.[0];



const manageSubscription = async () => {
    setLoadingManageSubscription(true);
    try {
      // Initialize Stripe
      const response = await axiosInstance.post("/payment/manage-subscription");
      const { session } = response.data;
      //open in new tab
      window.open(session, "_blank");
    } catch (err) {
      if(err instanceof AxiosError){
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setLoadingManageSubscription(false);
    }
  }

  if (!userPlan || !usageData) {
    return (
      <div className="min-h-screen bg-background p-6 sm:p-8 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-slate-600">Invalid subscription data</p>
        </div>
      </div>
    );
  }

  const UsageCard = ({title,used,total,unlimited,icon: Icon}: {
    title: string;
    used: number;
    total: number;
    unlimited?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
  }) => {
    const remaining = total - used;
    const progress = unlimited ? 0 : Math.min((used / total) * 100, 100);
    const isLow = !unlimited && remaining <= total * 0.2 && remaining > 0;
    const isFinished = remaining <= 0 && !unlimited;
    
    return (
      <div className={`rounded-xl border bg-white p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow ${
        isFinished 
          ? "border-red-200 bg-red-50/30" 
          : "border-slate-200"
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-slate-100 text-slate-600">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
              {title}
            </h4>
          </div>
          {!unlimited && (
            <span
              className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                isFinished
                  ? "bg-red-50 text-red-700 border-red-200"
                  : isLow
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {isFinished ? "Limit reached" : `${remaining} left`}
            </span>
          )}
        </div>  

        {/* Numbers */}
        <div className="mb-3">
          {unlimited ? (
            <>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                ∞
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                Unlimited
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {used}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                  / {total}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                used
              </p>
            </>
          )}
        </div>

        {/* Progress */}
        {!unlimited && (
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFinished 
                    ? "bg-red-500" 
                    : isLow 
                    ? "bg-amber-500" 
                    : "bg-slate-900"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {isFinished ? (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <p className="text-[10px] text-red-600 font-medium">
                  You've reached your limit
                </p>
              </div>
            ) : isLow && (
              <p className="text-[10px] text-amber-600 font-medium">
                Running low
              </p>
            )}
          </div>
        )}
        
        {/* Upgrade Warning for Finished Quota */}
        {isFinished && !unlimited && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <Button
              size="sm"
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs"
              asChild
            >
              <Link to="/dashboard/pricing">
                Upgrade Plan
              </Link>
            </Button>
          </div>
        )}

        {unlimited && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-emerald-600 font-medium">
              ✓ No limit
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto space-y-8 max-w-6xl">
        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            My Subscription
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View your current plan, usage, and billing details.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* USAGE SECTION */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                  Usage this billing period
                </h3>
                {
                  userPlan !== "PRO" && (
                    <p className="text-xs text-slate-500">
                      Renews on start of next month
                    </p>
                  )
                }
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <UsageCard
                  title="AI Chat Messages"
                  used={usageData.aiChatMessages}
                  total={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.chat ?? 0}
                  unlimited={userPlan === "PRO"}
                />

                <UsageCard
                  title="AI-Tailored Resumes"
                  used={usageData.aiTailoredResumes}
                  total={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.resumes ?? 0}
                  unlimited={userPlan === "PRO"}
                />

                <UsageCard
                  title="Cover Letters"
                  used={usageData.coverLetters}
                  total={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.covers ?? 0}
                  unlimited={userPlan === "PRO"}
                />

                <UsageCard
                  title="Analysis & Feedback"
                  used={usageData.resumeAnalyzeFeedback}
                  total={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.analyzerAndFeedback ?? 0}
                  unlimited={userPlan === "PRO"}
                />

                <UsageCard
                  title="Downloads"
                  used={usageData.downloadsAndTemplates}
                  total={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.downloadsAndTemplates ?? 0}
                  unlimited={userPlan !== "FREE"}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* CURRENT PLAN CARD */}
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 shadow-xs hover:shadow-sm transition-shadow">
              <div className="space-y-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-500 mb-2">
                    Current Plan
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap mb-3">
                    <h2 className="text-xl font-bold text-slate-900 ">
                      {userPlan}
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                      {data.data.userUsage.subscription?.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap mb-3">
                    <span className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                      $ {SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.price ?? 0}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase">
                      USD
                    </span>
                    {userPlan !== "FREE" && (
                      <span className="text-xs sm:text-sm text-slate-400">
                        / Monthly
                      </span>
                    )}
                  </div>
                  {userPlan !== "FREE" && data.data.userUsage.subscription?.periodEnd ? (
                    <p className="text-xs sm:text-sm text-slate-500">
                      Next billing date:{" "}
                      <span className="font-medium text-slate-700">
                        {new Date(data.data.userUsage.subscription.periodEnd).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500">
                      Enjoy free access to essential features
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  {userPlan === "FREE" ? (
                    <>
                      <Button
                        size="sm"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                        asChild
                      >
                        <Link to="/dashboard/pricing">
                          Upgrade Plan
                        </Link>
                      </Button>
                      <p className="text-[10px] sm:text-xs text-slate-500 text-center">
                        Unlock more features and higher limits
                      </p>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => manageSubscription()}
                      disabled={loadingManageSubscription}
                    >
                      {loadingManageSubscription ? <Loader2 className="h-4 w-4 animate-spin" /> : "Manage my subscription"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MySubscription;
