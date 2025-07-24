import {
  Hero,
  // Demo,
  Features,
  HowItWorks,
  Pricing,
  CTA,
} from './components'

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      {/* <Demo /> */}
      <Features />
      <Pricing />
      <HowItWorks />
      <CTA />
    </div>
  )
}