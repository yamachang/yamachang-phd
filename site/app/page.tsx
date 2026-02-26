import { Hero } from "@/components/Hero";
import { NewsTicker } from "@/components/NewsTicker";
import { StatsStrip } from "@/components/StatsStrip";
import { Divider } from "@/components/Divider";
import { AboutSection } from "@/components/AboutSection";
import { ResearchTimeline } from "@/components/ResearchTimeline";

export default function Home() {
  return (
    <>
      <Hero />
      <NewsTicker />
      <StatsStrip />
      <Divider />
      <AboutSection />
      <Divider />
      <ResearchTimeline />
    </>
  );
}
