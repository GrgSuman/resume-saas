import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useState } from "react";
import axiosInstance from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";

export default function PricingDialog() {
  const navigate = useNavigate();
  const {user} = useAuth();

  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  if(user?.subscription.plan !== "FREE") {
    navigate("/dashboard");
    return
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      planId: "FREE",
      description: "Great for trying CloneCV and exploring core features",
      features: [
        "20 AI messages / month",
        "2 job-tailored resumes",
        "2 job-tailored cover letters",
        "2 resume analyzer runs (basic)",
        "Unlimited job tracking",
        "Chrome extension",
        "Manual resume editing",
        "10 PDF downloads / month",
      ],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Starter",
      price: "$7",
      planId: "STARTER",
      description: "Perfect for active job seekers applying regularly",
      features: [
        "100 AI messages / month",
        "50 job-tailored resumes",
        "50 job-tailored cover letters",
        "50 resume analyzer runs (advanced)",
        "Chrome extension (full workflow)",
        "Unlimited job tracking",
        "Unlimited PDF downloads",
      ],
      cta: "Upgrade to Starter",
      highlight: true,
    },
    {
      name: "Pro",
      price: "$14",
      planId: "PRO",
      description: "Unlimited power users & high-volume applications",
      features: [
        "Unlimited AI messages",
        "Unlimited resume tailoring",
        "Unlimited cover letter tailoring",
        "Unlimited resume analysis",
        "Unlimited job tracking",
        "Chrome extension (full workflow)",
        "Priority AI processing",
        "Unlimited PDF downloads",
      ],
      cta: "Go Pro",
      highlight: false,
    },
  ];

  const handlePlanClick = async (planId: string) => {
    // Handle free plan - no payment needed
    if (planId === user?.subscription?.plan) {
      toast.info(`You're already on the ${user?.subscription?.plan} plan!`, {
        position: "top-center",
      });
      return;
    }

    setLoadingPlanId(planId);

    try {
      // Initialize Stripe
      const stripePromise = await loadStripe("pk_live_51RpilURpmJmQnVSV42vcOistNO4lRKbn2KMLHbfBHpz0pJHvnzhiGvtt9JXZzTGmfDqlzY9iY6mptyOCLEEGLJhj00XEZYEW9c")

      const response = await axiosInstance.post("/payment/create-checkout-session",
        {
          planId: planId,
        }
      );

      const { sessionId } = response.data;
      const stripe = await stripePromise;
  
      if (!stripe) {
        toast.error("Stripe is not initialized", {
          position: "top-right",
        });
        setLoadingPlanId(null);
        return;
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
  
      if (error) throw error;
        
    } catch (err) {
      if(err instanceof AxiosError){
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
        });
      }
      setLoadingPlanId(null);
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent
        className="
          min-w-[82vw]
          max-w-6xl
          h-[95vh]
          border-0
          p-0
          overflow-hidden
          rounded-xl
          flex flex-col
          bg-white
        "
      >
        {/* Header */}
        <div className="relative border-b bg-white/70 backdrop-blur-sm py-4 px-6 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 h-9 w-9 p-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Choose your plan
            </h3>
            <p className="text-sm text-slate-500">
              Upgrade only when you’re ready — simple & flexible pricing
            </p>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-xl border bg-white flex flex-col
                  transition-all duration-200
                  hover:shadow-md
                  ${
                    plan.highlight
                      ? "border-slate-900 shadow-sm"
                      : "border-slate-200"
                  }
                `}
              >
                {/* Badge */}
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md
                      bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-sm"
                    >
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="px-5 pt-6 pb-3">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {plan.name}
                  </h3>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-bold text-slate-900">
                      {plan.price}
                    </span>

                    {plan.price !== "$0" && (
                      <span className="text-sm text-slate-500 mb-1">/mo</span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Feature List */}
                <ul className="px-5 mt-3 space-y-2.5 flex-1 min-h-0 overflow-y-auto">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 items-start">
                      <Check className="h-4 w-4 text-slate-900 mt-0.5 flex-shrink-0 stroke-[2.4]" />
                      <span className="text-sm text-slate-600">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="px-5 pb-5 mt-4">
                  <Button
                    variant={plan.highlight ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan.planId)}
                    disabled={loadingPlanId !== null}
                    className={`
                      w-full h-10 text-sm font-medium rounded-md
                      ${
                        plan.highlight
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border-slate-300 text-slate-900 hover:bg-slate-50"
                      }
                      ${loadingPlanId === plan.planId ? "opacity-75 cursor-wait" : ""}
                    `}
                  >
                    {loadingPlanId === plan.planId ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            No credit card required • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
