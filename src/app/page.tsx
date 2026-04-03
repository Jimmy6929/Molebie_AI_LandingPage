import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Demo } from "@/components/demo";
import { DeploymentOverview } from "@/components/deployment-overview";
import { HowItWorks } from "@/components/how-it-works";
import { Comparison } from "@/components/comparison";
import { TrustBadges } from "@/components/trust-badges";
import { SystemRequirements } from "@/components/system-requirements";
import { FAQ } from "@/components/faq";
import { Architecture } from "@/components/architecture";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Demo />
        <DeploymentOverview />
        <HowItWorks />
        <Comparison />
        <TrustBadges />
        <SystemRequirements />
        <FAQ />
        <Architecture />
      </main>
      <Footer />
    </>
  );
}
