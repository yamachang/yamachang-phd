import { getAllPosts } from "@/lib/blog";
import { BlogPostCard } from "@/components/BlogPostCard";

export const metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl mb-12">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          No posts yet. Check back soon.
        </p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
