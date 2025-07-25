import { Button } from "../../../components/ui/button"

export default function BrutalistPricing() {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">SIMPLE PRICING</h2>
        <p className="text-lg text-gray-600 mb-12 font-mono">
          // Start free. Upgrade when you need more.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan - Brutalist Style */}
          <div className="border-4 border-gray-300 bg-white p-6 relative">
            <h3 className="text-xl font-black uppercase mb-2">FREE</h3>
            <div className="text-4xl font-black mb-6">$0</div>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>5 tailored resumes per month</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>PDF download</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>Basic templates</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full border-4 border-gray-300 text-black font-black uppercase tracking-wider hover:bg-gray-300 hover:text-black py-4"
            >
              GET STARTED
            </Button>
          </div>

          {/* Pro Plan - Brutalist Style */}
          <div className="border-4 border-black bg-white p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#00E0C6] text-black px-4 py-1 font-black uppercase border-2 border-black">
              POPULAR
            </div>
            <h3 className="text-xl font-black uppercase mb-2">PRO</h3>
            <div className="text-4xl font-black mb-2">$12<span className="text-lg text-gray-600">/MONTH</span></div>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>Unlimited tailored resumes</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>Premium templates</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>Cover letter generation</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>LinkedIn optimization</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-black text-white font-black uppercase tracking-wider hover:bg-gray-800 border-4 border-black py-4 hover:text-[#00E0C6]"
            >
              START 7-DAY TRIAL
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-8 font-mono">
          // Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  )
}