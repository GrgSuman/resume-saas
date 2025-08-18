import { loadStripe } from "@stripe/stripe-js";
import DashboardHeader from "../../components/layouts/DashboardHeader";
import { toast } from "sonner";
import axiosInstance from "../../api/axios";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";

const creditPacks = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 20,
    price: 4.99,
    priceDisplay: "$4.99",
    desc: "Perfect for occasional users",
    popular: false,
    savings: null,
    perCredit: 0.25,
    features: ["20 Credits", "Never Expires", "All Templates", "AI Optimization", "ATS Checker", "PDF & Word Export"],
    notIncluded: ["Priority Support"],
  },
  {
    id: "pro",
    name: "Professional Pack",
    credits: 50,
    price: 9.99,
    priceDisplay: "$9.99",
    desc: "Best value for active job seekers",
    popular: true,
    savings: "Save $2.50",
    perCredit: 0.2,
    features: ["50 Credits", "Never Expires", "All Templates", "AI Optimization", "ATS Checker", "PDF & Word Export", "Priority Support"],
    notIncluded: [],
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 120,
    price: 19.99,
    priceDisplay: "$19.99",
    desc: "Maximum value for professionals",
    popular: false,
    savings: "Save $10.01",
    perCredit: 0.17,
    features: [
      "120 Credits",
      "Never Expires",
      "All Templates",
      "AI Optimization",
      "ATS Checker",
      "PDF & Word Export",
      "Priority Support",
      "Dedicated Support",
    ],
    notIncluded: [],
  },
];

const costBreakdown = [
  { action: "Create new resume", cost: 3, description: "Full AI-powered resume creation" },
  { action: "Clone existing resume", cost: 2, description: "Duplicate and customize existing resume" },
  { action: "AI conversation (5 messages)", cost: 1, description: "Get AI feedback and suggestions" },
  { action: "Download PDF", cost: 2, description: "Export professional PDF format" },
  { action: "Export to Word", cost: 3, description: "Download editable .docx file" },
  { action: "AI optimization", cost: 3, description: "Enhance content with AI suggestions" },
  { action: "ATS checker", cost: 3, description: "Ensure ATS compatibility" },
];

const Credits = () => {

  const handleBuyCredits = async (pack: string) => {
    // Initialize Stripe
    const stripePromise = await loadStripe("pk_live_51RpilURpmJmQnVSV42vcOistNO4lRKbn2KMLHbfBHpz0pJHvnzhiGvtt9JXZzTGmfDqlzY9iY6mptyOCLEEGLJhj00XEZYEW9c")

    try {
      const response = await axiosInstance.post("/create-checkout-session",
        {
          packId: pack,
        }
      );

      const { sessionId } = response.data;
      const stripe = await stripePromise;

      if (!stripe) {
        toast.error("Stripe is not initialized", {
          position: "top-right",
        });
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
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <DashboardHeader />

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-12 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Credit Package</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. All credits never expire and can be used anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="px-4 py-16 mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:border-[#7060fc] hover:shadow-[#7060fc]/10 ${
                pack.popular ? "border-[#7060fc] shadow-[#7060fc]/10 scale-105" : "border-slate-200"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#7060fc] text-white px-6 py-2 text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pack.name}</h3>
                  <p className="text-slate-600">{pack.desc}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-slate-900 mb-2">{pack.priceDisplay}</div>
                  <div className="text-lg font-semibold text-[#7060fc] mb-1">{pack.credits} Credits</div>
                  <div className="text-sm text-slate-500">${pack.perCredit.toFixed(2)} per credit</div>
                  {pack.savings && <div className="text-sm text-green-600 font-semibold mt-1">{pack.savings}</div>}
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-slate-900 mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {pack.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                    {pack.notIncluded && pack.notIncluded.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 opacity-50">
                        <X className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBuyCredits(pack.id)}
                  className={`w-full py-4 px-6 font-semibold rounded-xl transition-all duration-200 ${
                    pack.popular
                      ? "bg-[#7060fc] text-white hover:bg-[#6050e5] shadow-lg"
                      : "bg-slate-100 text-slate-900 border border-slate-300 hover:bg-[#7060fc] hover:text-white hover:border-[#6050e5] hover:shadow-lg"
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="px-4 py-16 mx-auto max-w-6xl bg-white">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Credit Usage Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Action</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Credits</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Description</th>
                </tr>
              </thead>
              <tbody>
                {costBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6 font-medium text-slate-900">{item.action}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-[#7060fc]/10 text-[#7060fc] px-3 py-1 rounded-full font-semibold">
                        {item.cost}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* FAQ */}
      <div className="px-4 py-16 mx-auto max-w-4xl bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Do credits expire?</h3>
            <p className="text-slate-600">No, your credits never expire. Use them whenever you need them.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-slate-600">We accept all major credit cards through our secure Stripe checkout.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Can I get a refund?</h3>
            <p className="text-slate-600">
              Credits are non-refundable once purchased, but they never expire so you can use them anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-4 py-16 mx-auto max-w-4xl text-center bg-[#7060fc]">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your Perfect Resume?</h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of professionals who've advanced their careers with our platform.
        </p>
        <button
          onClick={() => handleBuyCredits("pro")}
          className="px-12 py-4 bg-white text-[#7060fc] font-bold text-lg rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg"
        >
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default Credits;
