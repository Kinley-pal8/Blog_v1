import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Enhanced markdown to HTML converter with light theme styling
function renderMarkdownWithLightTheme(markdown: string): string {
  let html = markdown;

  // TABLES - Process FIRST before any other replacements
  // Split content into lines and find table blocks
  const lines = html.split("\n");
  let processedHtml = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line is the start of a table (starts with |)
    if (line.trim().startsWith("|")) {
      const tableLines = [line];
      let j = i + 1;

      // Collect all consecutive table rows
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        tableLines.push(lines[j]);
        j++;
      }

      // Parse the table
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0];
        const separatorRow = tableLines[1];
        const dataRows = tableLines.slice(2);

        // Extract cells from header
        const headerCells = headerRow
          .split("|")
          .slice(1, -1) // Remove empty first and last elements
          .map((c) => c.trim());

        // Only process if separator row looks valid
        const isSeparatorValid = /^\|[\s:|-]+\|$/.test(separatorRow);

        if (headerCells.length > 0 && isSeparatorValid) {
          let table =
            '<table class="w-full border-collapse my-6 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"><thead><tr class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">';

          // Add header cells
          headerCells.forEach((cell) => {
            table += `<th class="px-4 py-3 text-left text-sm md:text-base text-slate-900 dark:text-slate-50 font-semibold">${cell}</th>`;
          });

          table += "</tr></thead><tbody>";

          // Add data rows
          dataRows.forEach((row) => {
            const cells = row
              .split("|")
              .slice(1, -1) // Remove empty first and last elements
              .map((c) => c.trim());

            if (cells.length > 0) {
              table +=
                '<tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">';
              cells.forEach((cell, idx) => {
                table += `<td class="px-4 py-3 text-sm md:text-base text-slate-700 dark:text-slate-300 ${idx === 0 ? "font-semibold text-slate-900 dark:text-slate-50" : ""}">${cell}</td>`;
              });
              table += "</tr>";
            }
          });

          table += "</tbody></table>";
          processedHtml += table + "\n";
          i = j;
          continue;
        }
      }
    }

    processedHtml += line + "\n";
    i++;
  }

  html = processedHtml;

  // Headings with light theme and better spacing
  html = html.replace(
    /^### (.*?)$/gm,
    '<h3 class="text-lg md:text-xl font-semibold tracking-wide mt-10 mb-4 text-slate-900 dark:text-slate-50 flex items-start gap-3"><span class="text-slate-400 dark:text-slate-600 font-light">▸</span>$1</h3>',
  );
  html = html.replace(
    /^## (.*?)$/gm,
    '<h2 class="text-2xl md:text-3xl font-light tracking-tight mt-16 mb-8 text-slate-900 dark:text-slate-50 border-l-4 border-slate-300 dark:border-slate-700 pl-6">$1</h2>',
  );
  html = html.replace(
    /^# (.*?)$/gm,
    '<h1 class="text-4xl md:text-5xl font-light tracking-tight mt-12 mb-8 text-slate-900 dark:text-slate-50">$1</h1>',
  );

  // Blockquotes / Callout boxes (lines starting with >)
  html = html.replace(
    /^> (.*?)$/gm,
    '<blockquote class="bg-slate-100 dark:bg-slate-900/50 border-l-4 border-slate-300 dark:border-slate-700 px-4 py-3 my-6 rounded text-sm md:text-base text-slate-700 dark:text-slate-300 font-light">$1</blockquote>',
  );

  // Images with markdown syntax ![alt](url)
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<figure class="my-10 rounded-lg overflow-hidden shadow-sm"><img src="$2" alt="$1" class="w-full h-auto object-cover rounded-lg" loading="lazy" /><figcaption class="text-sm text-slate-600 dark:text-slate-400 mt-3 italic">$1</figcaption></figure>',
  );

  // Bold and italic
  html = html.replace(
    /\*\*\*(.*?)\*\*\*/g,
    '<strong class="font-bold text-slate-900 dark:text-slate-50"><em class="italic">$1</em></strong>',
  );
  html = html.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-slate-900 dark:text-slate-50">$1</strong>',
  );
  html = html.replace(
    /\*(.*?)\*/g,
    '<em class="italic text-slate-700 dark:text-slate-300">$1</em>',
  );

  // Code blocks
  html = html.replace(/```(.*?)```/gs, (match, content) => {
    const trimmed = content.trim();
    return `<pre class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 my-6 overflow-x-auto"><code class="text-sm md:text-base text-slate-900 dark:text-slate-100 font-mono leading-relaxed font-light">${trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  });

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded text-slate-900 dark:text-slate-50 font-mono text-sm md:text-base">$1</code>',
  );

  // Horizontal rule
  html = html.replace(
    /^---$/gm,
    '<hr class="my-12 border-slate-200 dark:border-slate-800">',
  );

  // Lists with better styling
  html = html.replace(
    /^\* (.*?)$/gm,
    '<li class="ml-0 my-3 text-sm md:text-base text-slate-700 dark:text-slate-300 flex items-start gap-3 font-light"><span class="text-slate-400 dark:text-slate-600 font-bold mt-1 flex-shrink-0">◆</span><span>$1</span></li>',
  );
  html = html.replace(
    /^- (.*?)$/gm,
    '<li class="ml-0 my-3 text-sm md:text-base text-slate-700 dark:text-slate-300 flex items-start gap-3 font-light"><span class="text-slate-400 dark:text-slate-600 font-bold mt-1 flex-shrink-0">◆</span><span>$1</span></li>',
  );

  const listRegex = /(<li>.*?<\/li>)/s;
  if (listRegex.test(html)) {
    html = html.replace(
      listRegex,
      '<ul class="list-none space-y-1 my-8 pl-0">$1</ul>',
    );
  }

  // Paragraphs
  const paragraphLines = html.split("\n\n");
  html = paragraphLines
    .map((line) => {
      if (line.startsWith("<") || line.trim() === "" || line.startsWith("<li"))
        return line;
      return `<p class="text-sm md:text-base text-slate-700 dark:text-slate-300 my-6 leading-relaxed font-light">${line}</p>`;
    })
    .join("\n\n");

  return html;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="min-h-screen bg-inherit transition-colors duration-300">
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt || post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-slate-950"></div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <Link
          href="/blog"
          className="inline-block text-sm font-light tracking-widest uppercase text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-12 transition-colors"
        >
          ← Back to Blog
        </Link>

        <div className="mb-12">
          <span className="inline-block px-3 py-1 text-xs font-mono tracking-widest uppercase border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 mb-6">
            Article
          </span>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 text-slate-900 dark:text-slate-50 leading-tight"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {post.title}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-6 text-sm font-mono text-slate-600 dark:text-slate-400">
            <span>
              By{" "}
              {post.author_name ||
                post.author_email?.split("@")[0] ||
                "Anonymous"}
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span>
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-light tracking-widest uppercase px-3 py-2 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div
          className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed font-light"
          dangerouslySetInnerHTML={{
            __html: renderMarkdownWithLightTheme(post.content),
          }}
        />
      </section>
    </article>
  );
}
