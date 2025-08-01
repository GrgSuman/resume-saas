import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router"
    
export default function BrutalistHero() {
  const navigate = useNavigate()
  return (
    <section className="pt-12 bg-white min-h-[50vh]">
      <div className="container mx-auto px-[3%] py-12">
        <div className="text-center my-20">
          <div className="space-y-3 mb-8">
            <h1 className="text-4xl lg:text-6xl font-black text-black leading-[0.9] tracking-tight uppercase">
              Talk, tweak, and get hired
            </h1>

            <div className="max-w-xl mx-auto">
              <p className="text-lg text-gray-600 mt-5 font-mono">No clunky forms. Just chat, duplicate, tweak — your resume evolves with you.</p>
             
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button onClick={() => navigate("/signin")} className="group px-8 py-4 bg-black text-white font-bold text-lg uppercase tracking-wider border-2 border-black hover:bg-[#00E0C6] hover:text-black transition-all duration-200 flex items-center gap-2">
              BUILD NOW FOR FREE
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>

            <button className="px-8 py-4 border-2 border-black text-black font-bold text-lg uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-200">
              VIEW SAMPLES
            </button>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="bg-black p-4 border-4 border-black">
            <div className="bg-white p-2">
              <img
                src="/hero.png"
                alt="Resume Builder"
                className="w-full h-auto border-2 border-gray-200"
              />
            </div>
          </div>

          <div className="absolute -top-2 -left-2 bg-[#00E0C6] text-black px-4 py-2 font-bold text-base uppercase border-2 border-black">
            EDITOR
          </div>

          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-4 py-2 font-bold text-base uppercase border-2 border-black">
            EXPORT
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-4 my-12 max-w-xl mx-auto">
          <div className="text-center border-2 border-black p-4">
            <div className="text-2xl font-black text-black">50K+</div>
            <div className="text-xs font-bold uppercase">USERS</div>
          </div>
          <div className="text-center border-2 border-black p-4 bg-[#00E0C6]">
            <div className="text-2xl font-black text-black">2MIN</div>
            <div className="text-xs font-bold uppercase">SETUP</div>
          </div>
          <div className="text-center border-2 border-black p-4">
            <div className="text-2xl font-black text-black">100%</div>
            <div className="text-xs font-bold uppercase">FREE</div>
          </div>
        </div> */}
      </div>
    </section>
  )
}