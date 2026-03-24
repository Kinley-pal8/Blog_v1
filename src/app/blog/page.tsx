import { getPublishedPosts } from "@/lib/blog-data";
import { BlogCard } from "@/components/BlogCard";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen pt-40 pb-20 max-w-7xl mx-auto px-8 transition-colors duration-300">
      <div className="mb-20 slide-in-up">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter text-slate-900 dark:text-slate-50">
          BLOG
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-light">
          {posts.length === 0
            ? "No posts published yet"
            : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 font-light">
            No published posts yet.
          </p>
          <p className="text-slate-500 dark:text-slate-600 font-light">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, index) => (
            <div
              key={post.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="slide-in-up"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
