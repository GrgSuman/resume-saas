import { Button } from "../../../components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-black text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Stop rewriting your resume from scratch
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join 12,000+ job seekers who save hours with AI tailoring
        </p>
        <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-12 px-8">
          Try it free now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  )
} 