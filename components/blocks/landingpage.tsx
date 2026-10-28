"use client";

import dynamic from "next/dynamic";

const FeaturesTabs = dynamic(
  () => import("@/components/blocks/features-tabs").then((mod) => mod.FeaturesTabs),
  { loading: () => <p>Loading features...</p> }
);

const JourneySection = dynamic(
  () => import("@/components/blocks/jounery").then((mod) => mod.JourneySection),
  { loading: () => <p>Loading journey...</p> }
);

const PricingSinglePlan = dynamic(
  () => import("@/components/blocks/pricing-single-plan").then((mod) => mod.PricingSinglePlan),
  { loading: () => <p>Loading pricing...</p> }
);

const HeroGridMinimal = dynamic(
  () => import("@/components/utlis/hero").then((mod) => mod.HeroGridMinimal),
  { loading: () => <p>Loading hero...</p> }
);

// const LogosMarquee = dynamic(
//   () => import("@/components/blocks/logos-marquee").then((mod) => mod.LogosMarquee),
//   { loading: () => <p>Loading logos...</p> }
// );

export default function LandingPage() {
  return (
    <>
      <HeroGridMinimal />
      <FeaturesTabs />
      <PricingSinglePlan />
      <JourneySection />
      {/* <LogosMarquee /> */}
    </>
  );
}