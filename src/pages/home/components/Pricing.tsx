import { Button } from "../../../components/ui/button"

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
        <p className="text-xl text-gray-700 mb-12">
          Start free. Upgrade when you need more.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-300 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <div className="text-3xl font-bold mb-6">$0</div>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                5 tailored resumes per month
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                PDF download
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                Basic templates
              </li>
            </ul>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">Get started</Button>
          </div>

          <div className="border-2 border-black rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-sm">
              Popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="text-3xl font-bold mb-6">$12<span className="text-lg text-gray-600">/month</span></div>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                Unlimited tailored resumes
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                Premium templates
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                Cover letter generation
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                LinkedIn optimization
              </li>
            </ul>
            <Button className="w-full bg-black hover:bg-gray-800">Start 7-day trial</Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-8">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  )
} 