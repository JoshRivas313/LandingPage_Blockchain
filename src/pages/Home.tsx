import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Credential } from "@/sections/Credential"
import { Hero } from "@/sections/Hero"
import { Partners } from "@/sections/Partners"
import { Schedule } from "@/sections/Schedule"
import { Speakers } from "@/sections/Speakers"

export function Home() {
  return (
    <div className="bc-shell">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Speakers />
        <Schedule />
        <Credential />
      </main>
      <Footer />
    </div>
  )
}
