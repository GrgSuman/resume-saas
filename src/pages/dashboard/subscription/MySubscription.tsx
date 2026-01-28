import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { SUBSCRIPTION_PLAN_LIMITS } from "../types/constants";
import { Link } from "react-router";
import { 
  Loader2, 
  MessageSquare,
  FileText,
  // Sparkles,
  Download,
  Check,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useState } from "react";
import SubscriptionLoadingSkeleton from "./SubscriptionLoadingSkeleton";

const MySubscription = () => {
  const [loadingManageSubscription, setLoadingManageSubscription] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["usage"],
    queryFn: () => axiosInstance.get("/auth/usage"),
  });

  if (isLoading) return <SubscriptionLoadingSkeleton />;

  if (isError || !data?.data?.userUsage) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
        <div className="rounded-full bg-red-50 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">Failed to load subscription</h3>
        <Button 
          variant="link" 
          onClick={() => window.location.reload()} 
          className="mt-2 text-slate-500"
        >
          Try again
        </Button>
      </div>
    );
  }

  const userPlan = data.data.userUsage.subscription?.plan;
  const usageData = data.data.userUsage.usage;
  const isPro = userPlan === "PRO";

  const manageSubscription = async () => {
    setLoadingManageSubscription(true);
    try {
      const response = await axiosInstance.post("/payment/manage-subscription");
      window.open(response.data.session, "_blank");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error("Unable to open billing portal.");
      }
    } finally {
      setLoadingManageSubscription(false);
    }
  };

  /* --- Sub-Components --- */

  const UsageItem = ({
    label,
    count,
    limit,
    isUnlimited,
    icon: Icon
  }: {
    label: string;
    count: number;
    limit: number;
    isUnlimited: boolean;
    icon: React.ElementType;
  }) => {
    const progress = isUnlimited ? 0 : Math.min((count / limit) * 100, 100);
    const isFull = !isUnlimited && count >= limit;

    return (
      <div className="flex flex-col space-y-3 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-500">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </div>
          <div className="text-right">
            {isUnlimited ? (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Unlimited</span>
            ) : (
              <span className="text-xs font-medium text-slate-600">
                {count} <span className="text-slate-400">/ {limit}</span>
              </span>
            )}
          </div>
        </div>

        {/* Minimal Progress Bar */}
        {!isUnlimited && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? "bg-red-500" : "bg-slate-900"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            Subscription
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your billing information and view usage statistics.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
          
          {/* LEFT: Usage List (Clean List View) */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900">Current Usage</h3>
                <span className="text-xs text-slate-500">
                  Resets starting from 1st of next month
                </span>
              </div>
              
              <div className="space-y-6">
                <UsageItem 
                  label="AI Chat Messages"
                  count={usageData.aiChatMessages}
                  limit={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.chat ?? 0}
                  isUnlimited={isPro}
                  icon={MessageSquare}
                />
                <div className="h-px bg-slate-100" />
                
                <UsageItem 
                  label="Auto Tailored Resumes"
                  count={usageData.aiTailoredResumes}
                  limit={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.resumes ?? 0}
                  isUnlimited={isPro}
                  icon={FileText}
                />
                <div className="h-px bg-slate-100" />

                <UsageItem 
                  label="Cover Letters"
                  count={usageData.coverLetters}
                  limit={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.covers ?? 0}
                  isUnlimited={isPro}
                  icon={FileText}
                />
                <div className="h-px bg-slate-100" />

                {/* <UsageItem 
                  label="Resume Analysis"
                  count={usageData.resumeAnalyzeFeedback}
                  limit={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.analyzerAndFeedback ?? 0}
                  isUnlimited={isPro}
                  icon={Sparkles}
                />
                <div className="h-px bg-slate-100" /> */}

                <UsageItem 
                  label="Resume Downloads"
                  count={usageData.downloadsAndTemplates}
                  limit={SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.downloadsAndTemplates ?? 0}
                  isUnlimited={userPlan !== "FREE"}
                  icon={Download}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Plan Details (Minimal Card) */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-900">Current Plan</h3>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
                    PRO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    FREE
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">
                    ${SUBSCRIPTION_PLAN_LIMITS[userPlan as keyof typeof SUBSCRIPTION_PLAN_LIMITS]?.price ?? 0}
                  </span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {isPro 
                    ? "You have full access to all AI features and unlimited generation." 
                    : "You are currently on the free tier with limited generation credits."}
                </p>
              </div>

              {userPlan === "FREE" ? (
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                  asChild
                >
                  <Link to="/dashboard/pricing">Upgrade Plan</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-slate-200 bg-white hover:bg-slate-50 text-slate-900"
                  onClick={manageSubscription}
                  disabled={loadingManageSubscription}
                >
                  {loadingManageSubscription && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  Manage Subscription
                </Button>
              )}
            </div>

            {/* Feature List */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Included in your plan
              </h4>
              <ul className="space-y-2.5">
                {userPlan === "FREE" ? (
                  <>
                    {[
                      "20 AI messages / month",
                      "2 job-tailored resumes",
                      "2 job-tailored cover letters",
                      // "2 resume analyzer runs (basic)",
                      "Unlimited job tracking",
                      "Chrome extension",
                      "Manual resume editing",
                      "10 resume downloads / month",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </>
                ) : userPlan === "STARTER" ? (
                  <>
                    {[
                      "100 AI messages / month",
                      "50 job-tailored resumes",
                      "50 job-tailored cover letters",
                      // "50 resume analyzer runs (advanced)",
                      "Chrome extension (full workflow)",
                      "Unlimited job tracking",
                      "Unlimited Resume downloads",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      "Unlimited AI messages",
                      "Unlimited job-tailored resumes",
                      "Unlimited job-tailored cover letters",
                      // "Unlimited resume analyzer runs (advanced)",
                      "Chrome extension (full workflow)",
                      "Unlimited job tracking",
                      "Unlimited Resume downloads",
                      "Priority Support",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MySubscription;