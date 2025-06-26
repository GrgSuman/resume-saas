import { Button } from "../../../components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="features" className="text-3xl font-bold mb-4">Everything you need to land your dream job</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Powerful AI features that make resume building effortless and effective
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Tailoring */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">AI-Powered Tailoring</h3>
            <p className="text-gray-700 text-sm mb-4">
              Our AI analyzes job descriptions and automatically customizes your resume to match the role requirements.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                Keyword optimization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                Skill highlighting
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                Experience alignment
              </li>
            </ul>
          </div>

          {/* Multiple Templates */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Professional Templates</h3>
            <p className="text-gray-700 text-sm mb-4">
              Choose from 20+ ATS-friendly templates designed for different industries and experience levels.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                ATS-optimized layouts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                Industry-specific designs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                Mobile-responsive
              </li>
            </ul>
          </div>

          {/* Real-time Chat */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">AI Chat Assistant</h3>
            <p className="text-gray-700 text-sm mb-4">
              Chat with AI to get instant feedback, suggestions, and improvements for your resume.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                Real-time suggestions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                Writing improvements
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                Career advice
              </li>
            </ul>
          </div>

          {/* Version Control */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Version Control</h3>
            <p className="text-gray-700 text-sm mb-4">
              Keep track of all your resume versions and easily switch between different iterations.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                Unlimited versions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                Easy comparison
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                One-click restore
              </li>
            </ul>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-red-600 text-xl">📤</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Multiple Export Formats</h3>
            <p className="text-gray-700 text-sm mb-4">
              Export your resume in PDF, Word, or plain text formats for any application system.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                High-quality PDF
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                Editable Word docs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                ATS-compatible text
              </li>
            </ul>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-indigo-600 text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Resume Analytics</h3>
            <p className="text-gray-700 text-sm mb-4">
              Get insights into your resume's performance and suggestions for improvement.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                ATS score tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                Keyword analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                Improvement tips
              </li>
            </ul>
          </div>
        </div>

        {/* Feature CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-black hover:bg-gray-800 h-12 px-8">
            Explore all features
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
} 