import { Button } from "../../../components/ui/button"
import { useNavigate } from "react-router"

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-20 px-6  bg-gradient-to-b from-white via-purple-50 to-purple-200">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Create the perfect resume<br />for every job in seconds
        </h1>
        
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Stop rewriting your resume from scratch. Just paste the job description and let AI instantly customize your resume to match any role. Save hours, land more interviews, and get hired faster.
        </p>
        
        <Button size="lg" onClick={() => navigate("/dashboard")} className="bg-black cursor-pointer hover:bg-gray-800 h-12 px-8 text-base">
          Start now — it's free
        </Button>
      </div>
    </section>
  )
} 