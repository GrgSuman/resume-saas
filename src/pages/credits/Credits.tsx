import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import DashboardHeader from "../../components/layouts/DashboardHeader";
import { toast } from "sonner";
import axiosInstance from "../../api/axios";

const creditPacks = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 20,
    price: 4.99,
    priceDisplay: "$4.99",
    desc: "Perfect for quick edits & small updates.",
    color: "bg-yellow-300",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 50,
    price: 9.99,
    priceDisplay: "$9.99",
    desc: "For active job seekers who need more AI help.",
    color: "bg-pink-300",
    popular: true,
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 120,
    price: 19.99,
    priceDisplay: "$19.99",
    desc: "Best value — for heavy resume builders.",
    color: "bg-green-300",
    popular: false,
  },
];

const featureBreakdown = [
  { action: "Create new resume", cost: 3 },
  { action: "Clone existing resume", cost: 2 },
  { action: "AI conversation (per 5 messages)", cost: 1 },
  { action: "Download PDF", cost: 2 },
  { action: "Export to Docx", cost: 3 },
  { action: "AI optimization and ATS Checker", cost: 3 },
];

const faqs = [
  {
    question: "Do credits expire?",
    answer: "No, your credits never expire. Use them whenever you need them.",
  },
  {
    question: "Can I get a refund?",
    answer: "Credits are non-refundable once purchased, but they never expire.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards through our secure Stripe checkout.",
  },
];

const Credits = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleBuyCredits = async (pack: string) => {
    // Initialize Stripe
    const stripePromise = await loadStripe(
      "pk_test_51RpilqRtBE3WEzfFOjYZ79SlZZigBXhAADtol7Ku17mKizzGabTKPJiTjlRqDwB3xmk60GQsxid6yLZWkYX0nihs00bfDJGcX4"
    );

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

      toast.success("Redirecting to checkout...", {
        position: "top-right",
      });
      
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen">
      <DashboardHeader />

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Pricing Packs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold uppercase mb-6 text-center">
            Choose Your Pack
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                className={`relative p-6 border-4 border-black rounded-lg ${pack.color} shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-2xl font-extrabold uppercase">
                    {pack.name}
                  </h3>
                  <p className="text-gray-700 text-sm">{pack.desc}</p>
                </div>
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-1">
                    {pack.priceDisplay}
                  </div>
                  <div className="text-lg font-mono font-semibold">
                    {pack.credits} Credits
                  </div>
                </div>
                <button
                  onClick={() => handleBuyCredits(pack.id)}
                  className={`w-full py-3 border-2 border-black font-bold transition-all ${"bg-black text-white hover:bg-white hover:text-black"} rounded-lg shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Breakdown */}
        <div className="mb-16">
          <div className="border-4 border-black bg-gray-50 rounded-lg p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold uppercase mb-6 text-center">
              How Credits Work
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Feature Costs</h3>
                <ul className="space-y-3">
                  {featureBreakdown.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between py-2 border-b border-gray-200"
                    >
                      <span>{item.action}</span>
                      <span className="font-bold">{item.cost} credits</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-50 border-2 border-black p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Credit Tips</h3>
                <ul className="space-y-3 list-disc pl-5">
                  <li>Credits never expire - use them anytime</li>
                  <li>Bulk purchases save you money</li>
                  <li>Check your balance anytime in your dashboard</li>
                  <li>Unused credits carry over indefinitely</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600">
              All prices in USD. Taxes may apply based on your location.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold uppercase mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-2 border-black rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 bg-orange-100 text-left font-bold flex justify-between items-center hover:bg-orange-200 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">
                    {activeFaq === index ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="p-4 bg-white">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA at bottom */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">Need more help deciding?</h3>
          <button className="px-6 py-3 bg-black text-white font-bold border-2 border-black rounded-lg hover:bg-white hover:text-black transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Credits;
