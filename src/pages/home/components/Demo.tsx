import { Upload } from "lucide-react"

export default function Demo() {
  return (
    <section className="pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">See it work</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <p className="text-gray-700">Upload your current resume</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <p className="text-gray-700">Paste the job description</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <p className="text-gray-700">Download your tailored resume</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Upload size={16} />
                  <span>resume.pdf uploaded</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-800">
                    "Make this resume perfect for a Senior Product Manager role at Stripe"
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span>Tailoring your resume...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 