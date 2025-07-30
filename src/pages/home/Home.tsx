import {
  Hero,
  Features,
  // Pricing
} from './components'

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Features />
      {/* <Pricing /> */}
    </div>
  )
}