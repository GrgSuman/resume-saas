import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      description: "For individuals trying AI resume building.",
      features: [
        "20 AI messages / month",
        "Up to 3 active resumes",
        "Access to all templates",
        "Smart AI resume suggestions",
        "Real-time editor",
        "Export to PDF",
      ],
      tagline:
        "Perfect to explore CloneCV and build your first professional resume.",
      cta: "Start Free Trial",
      popular: false,
      ctaVariant: "outline" as const,
    },
    {
      name: "Starter",
      price: "$5",
      period: "month",
      description:
        "For job seekers who apply often and want unlimited AI help.",
      features: [
        "Unlimited AI messages",
        "Up to 10 active resumes",
        "Priority AI responses",
        "Advanced job matching & resume tailoring",
        "Access to new templates first",
        "Real-time editor",
        "Export to PDF",
      ],
      tagline:
        "🔥 Most popular — unlock full AI power and faster response times.",
      cta: "Get Started",
      popular: true,
      ctaVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      period: "",
      description: "For recruiters, universities, and career platforms.",
      features: [
        "Unlimited resumes & messages",
        "Team access with shared workspace",
        "Custom AI model integration",
        "API access",
        "Dedicated support & onboarding",
      ],
      tagline: "Tailored AI resume tools for your organization.",
      cta: "Contact Sales",
      popular: false,
      ctaVariant: "outline" as const,
    },
  ];

  return (
    <section className="relative overflow-hidden  py-10" id="pricing">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-emerald-100 bg-white/80 px-4 py-1 text-sm font-medium text-emerald-900 shadow-sm">
              Transparent pricing, cancel anytime
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-slate-900 mb-4">
            Pick a plan that scales with you
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500">
            Every plan includes our conversational AI editor, ATS-optimized templates, and real-time formatting engine.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur ${
                plan.popular
                  ? "border-[#0e4e42] bg-white"
                  : "border-slate-200/70 bg-white/90"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-black px-5 py-1 text-sm font-medium text-white shadow-lg">
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                  {plan.popular && <span className="text-sm font-medium text-[#0e4e42]">Best value</span>}
                </div>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-slate-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-500">/ {plan.period}</span>
                  )}
                </div>
                <p className="text-slate-500">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6 flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-base text-slate-600">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tagline */}
              <div className="mb-6 rounded-2xl bg-slate-50/80 p-4">
                <p className="text-sm text-slate-600">{plan.tagline}</p>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                className={`h-12 rounded-full text-base font-medium transition-all ${
                  plan.ctaVariant === "default"
                    ? "bg-black text-white  hover:scale-[1.02]"
                    : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Link to="https://app.clonecv.com/dashboard/credits" target="_blank">
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            No credit card required for Free plan. Upgrade or cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
