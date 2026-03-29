import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { SystemRequirements } from "@/components/system-requirements";
import { Architecture } from "@/components/architecture";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="h-[3px] bg-accent-yellow" />
        <Features />
        <div className="h-[3px] bg-accent-yellow" />
        <HowItWorks />
        <div className="h-[3px] bg-accent-yellow" />
        <SystemRequirements />
        <div className="h-[3px] bg-accent-yellow" />
        <Architecture />
      </main>
      <Footer />
    </>
  );
}
