
import Hero from "@/components/organisms/general/about/Hero"
import Features from "@/components/organisms/general/about/Features"
import Process from "@/components/organisms/general/about/Process"
import CallToAction from "@/components/organisms/general/about/CallToAction"

export default function AboutTPage() {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow">
        <Hero />
        <Features />
        <Process />
        <CallToAction />
      </main>
    </div>
  )
}
