"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/blog-data";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="border-b border-slate-200 dark:border-slate-700 pb-12 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-300">
      {post.cover_image_url && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-64 w-full mb-8 overflow-hidden image-reveal group rounded-lg">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
      )}

      <div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50 hover:opacity-80 transition-opacity duration-300 tracking-tight">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <div className="flex items-center justify-between mb-4 text-xs text-slate-500 dark:text-slate-500 font-light tracking-widest uppercase gap-4">
          <span>{date}</span>
          <span>
            By{" "}
            {post.author_name ||
              post.author_email?.split("@")[0] ||
              "Anonymous"}
          </span>
        </div>

        <p className="text-base text-slate-700 dark:text-slate-300 mb-8 leading-relaxed font-light">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-light tracking-wide uppercase hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300 font-light text-sm tracking-wide uppercase group"
        >
          Read More
          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
