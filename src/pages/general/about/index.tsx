
import Hero from "@/components/organisms/about/Hero"
import Features from "@/components/organisms/about/Features"
import Process from "@/components/organisms/about/Process"
import CallToAction from "@/components/organisms/about/CallToAction"

export default function AboutTPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Features />
        <Process />

        <CallToAction />
      </main>
    </div>
  )
}
