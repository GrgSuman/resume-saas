import { Upload, MessageSquare, Download } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Upload</h3>
            <p className="text-gray-700">
              Upload your existing resume or start from scratch
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Describe</h3>
            <p className="text-gray-700">
              Tell us about the job or paste the job posting
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Download</h3>
            <p className="text-gray-700">
              Get your perfectly tailored resume in seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 