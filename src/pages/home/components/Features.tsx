export default function BrutalistFeatures() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">EVERYTHING YOU NEED</h2>
          <p className="text-lg text-gray-600 font-mono">
            // Powerful AI features that make resume building effortless and effective
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Chat to Build */}
          <div className="border-4 border-black p-8 bg-white h-full">
            <div className="text-4xl mb-6">💬</div>
            <h3 className="text-xl font-black uppercase mb-4">CHAT TO BUILD</h3>
            <p className="text-gray-700 mb-6">
              Build your resume through conversation. Just tell the AI what you want — it writes, updates, and optimizes content instantly.
            </p>
            <div className="h-1 w-full bg-black mb-6"></div>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>Natural language interface</span>
              </li>
            </ul>
          </div>

          {/* No Boring Forms */}
          <div className="border-4 border-black p-8 bg-white h-full">
            <div className="text-4xl mb-6">✂️</div>
            <h3 className="text-xl font-black uppercase mb-4">NO BORING FORMS</h3>
            <p className="text-gray-700 mb-6">
              Skip the traditional step-by-step forms. Edit freely or use AI suggestions. Simple, intuitive, and non-restrictive.
            </p>
            <div className="h-1 w-full bg-black mb-6"></div>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>Free-form editing</span>
              </li>
            </ul>
          </div>

          {/* Clone & Customize */}
          <div className="border-4 border-black p-8 bg-white h-full">
            <div className="text-4xl mb-6">🧾</div>
            <h3 className="text-xl font-black uppercase mb-4">CLONE & CUSTOMIZE</h3>
            <p className="text-gray-700 mb-6">
              Duplicate existing resumes in one click. Tweak just the parts you need — no risk of breaking your original.
            </p>
            <div className="h-1 w-full bg-black mb-6"></div>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>One-click duplication</span>
              </li>
            </ul>
          </div>

          {/* Smart AI Suggestions */}
          <div className="border-4 border-black p-8 bg-[#00E0C6] bg-opacity-10 h-full">
            <div className="text-4xl mb-6">🤖</div>
            <h3 className="text-xl font-black uppercase mb-4">SMART AI SUGGESTIONS</h3>
            <p className="text-gray-700 mb-6">
              Get real-time feedback on your resume. AI highlights what to improve, tailors content to jobs, and boosts your profile.
            </p>
            <div className="h-1 w-full bg-black mb-6"></div>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>ATS optimization</span>
              </li>
            </ul>
          </div>

          {/* Modern Templates */}
          <div className="border-4 border-black p-8 bg-white h-full">
            <div className="text-4xl mb-6">🎨</div>
            <h3 className="text-xl font-black uppercase mb-4">MODERN TEMPLATES</h3>
            <p className="text-gray-700 mb-6">
              Choose from clean, professional designs. Stand out while staying recruiter- and ATS-friendly.
            </p>
            <div className="h-1 w-full bg-black mb-6"></div>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>ATS-ready layouts</span>
              </li>
            </ul>
          </div>

          {/* Instant Export */}
          <div className="border-4 border-black p-8 bg-white h-full">
            <div className="text-4xl mb-6">📤</div>
            <h3 className="text-xl font-black uppercase mb-4">INSTANT EXPORT</h3>
            <p className="text-gray-700 mb-6">
              Download in PDF. Ready for applications, LinkedIn, or print — no extra formatting needed.
            </p>
            <div className="h-1 w-full bg-black mb-6"></div>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black mt-2"></div>
                <span>One-click downloads</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}