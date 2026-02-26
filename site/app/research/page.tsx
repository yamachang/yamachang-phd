import { ProjectGrid } from "@/components/ProjectGrid";

export const metadata = {
  title: "Research | Yama Chang",
};

export default function ResearchPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl mb-12">Research</h1>
      <ProjectGrid />
    </section>
  );
}
