import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Credential } from "@/sections/Credential"
import { Hero } from "@/sections/Hero"
import { Partners } from "@/sections/Partners"
import { Schedule } from "@/sections/Schedule"
import { Speakers } from "@/sections/Speakers"
import { Wall } from "@/sections/Wall"
import { useReveal } from "@/hooks/useReveal"

export function Home() {
  useReveal()

  return (
    <div className="bc-shell">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Speakers />
        <Schedule />
        <Credential />
        <Wall />
      </main>
      <Footer />
    </div>
  )
}
