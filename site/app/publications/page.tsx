import { PublicationList } from "@/components/PublicationList";

export const metadata = {
  title: "Publications | Yama Chang",
};

export default function PublicationsPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl mb-12">Publications</h1>
      <PublicationList />
    </section>
  );
}
