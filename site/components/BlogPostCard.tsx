import Link from "next/link";
import { BlogPost } from "@/types";

export function BlogPostCard({ post }: { readonly post: BlogPost }) {
  return (
    <article className="border-b border-[var(--color-border)] pb-8">
      <Link href={`/blog/${post.slug}`} className="group block">
        <p className="font-mono text-xs text-[var(--color-muted)] mb-2">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <span className="mx-2">&middot;</span>
          {post.readingTime} min read
        </p>
        <h2 className="font-heading text-xl font-semibold text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
          {post.title}
        </h2>
        <p className="text-sm text-[var(--color-body)] leading-relaxed mb-3">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
