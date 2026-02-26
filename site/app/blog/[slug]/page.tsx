import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.frontmatter.title };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="font-mono text-xs text-[var(--color-accent)] hover:underline mb-8 inline-block"
      >
        &larr; Back to Blog
      </Link>

      <header className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-heading)] mb-4">
          {post.frontmatter.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <span className="font-mono text-xs">
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>&middot;</span>
          <span className="font-mono text-xs">
            {post.frontmatter.readingTime} min read
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose prose-zinc dark:prose-invert max-w-none
        prose-headings:font-heading prose-headings:text-[var(--color-heading)]
        prose-p:text-[var(--color-body)] prose-p:leading-relaxed
        prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[var(--color-heading)]
        prose-code:font-mono prose-code:text-sm
        prose-li:text-[var(--color-body)]"
      >
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
