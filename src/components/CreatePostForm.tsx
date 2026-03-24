"use client";

import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [uploading, setUploading] = useState(false);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Only auto-generate slug if user hasn't manually edited it
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImageUrl(data.url);
        setCoverImageAlt(file.name);
      } else {
        setError("Failed to upload image");
      }
    } catch (err) {
      setError("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      if (!slug.trim()) {
        throw new Error("Slug is required");
      }
      if (!content.trim()) {
        throw new Error("Content is required");
      }

      const authorName =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          tags,
          published,
          cover_image_url: coverImageUrl,
          cover_image_alt: coverImageAlt,
          author_email: user?.primaryEmailAddress?.emailAddress || "",
          author_id: user?.id || "",
          author_name:
            authorName ||
            user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
            "Anonymous",
        }),
      });

      if (res.ok) {
        setSuccess("Post created successfully!");
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent("");
        setTags([]);
        setCoverImageUrl("");
        setCoverImageAlt("");
        setPublished(false);
        setViewMode("edit");
        setTimeout(() => {
          setSuccess("");
          onSuccess?.();
        }, 2000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating post");
    } finally {
      setLoading(false);
    }
  }

  const markdownToHtml = (md: string): string => {
    let html = md;

    // Process code blocks first (triple backticks)
    html = html.replace(/```([\s\S]*?)```/g, (match, content) => {
      const trimmed = content.trim();
      return `<pre class="bg-slate-900 border border-slate-700 rounded p-4 my-4 overflow-x-auto"><code class="text-slate-100 font-mono text-sm">${trimmed
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</code></pre>`;
    });

    // Process inline code (single backticks)
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-slate-800 px-2 py-1 rounded text-slate-100 font-mono text-sm">$1</code>',
    );

    // Process images
    html = html.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-lg" /><figcaption class="text-sm text-slate-500 mt-2 italic">$1</figcaption></figure>',
    );

    // Process links
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline">$1</a>',
    );

    // Process blockquotes (lines starting with >)
    html = html.replace(
      /^> (.*?)$/gm,
      '<blockquote class="border-l-4 border-slate-400 pl-4 py-2 my-3 italic text-slate-600">$1</blockquote>',
    );

    // Process tables - matches markdown table syntax
    const tableRegex = /\|(.+)\n\|[\s:|-]+\n((?:\|.+\n)*)/g;
    html = html.replace(
      tableRegex,
      (match: string, headerLine: string, bodyLines: string) => {
        const headers = headerLine.split("|").filter((h: string) => h.trim());
        const rows = bodyLines
          .trim()
          .split("\n")
          .filter((r: string) => r.trim());

        let table =
          '<table class="w-full border-collapse border border-slate-300 my-4"><thead>';
        table += '<tr class="bg-slate-200 dark:bg-slate-700">';
        headers.forEach((h: string) => {
          table += `<th class="border border-slate-300 px-4 py-2 text-left font-semibold">${h.trim()}</th>`;
        });
        table += "</tr></thead><tbody>";

        rows.forEach((row: string) => {
          const cells = row.split("|").filter((c: string) => c.trim());
          table += '<tr class="hover:bg-slate-100 dark:hover:bg-slate-800">';
          cells.forEach((cell: string) => {
            table += `<td class="border border-slate-300 px-4 py-2">${cell.trim()}</td>`;
          });
          table += "</tr>";
        });

        table += "</tbody></table>";
        return table;
      },
    );

    // Split into lines for processing
    const lines = html.split("\n");
    let output: string[] = [];
    let i = 0;

    while (i < lines.length) {
      let line = lines[i];

      // Skip empty lines and already processed elements
      if (
        line.includes("<pre") ||
        line.includes("<table") ||
        line.includes("<blockquote") ||
        line.includes("<figure") ||
        line.includes("<img")
      ) {
        output.push(line);
        i++;
        continue;
      }

      // Process headings
      if (line.startsWith("# ")) {
        output.push(
          `<h1 class="text-3xl font-bold mt-6 mb-3">${line.slice(2)}</h1>`,
        );
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        output.push(
          `<h2 class="text-2xl font-bold mt-5 mb-3">${line.slice(3)}</h2>`,
        );
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        output.push(
          `<h3 class="text-xl font-semibold mt-4 mb-2">${line.slice(4)}</h3>`,
        );
        i++;
        continue;
      }

      // Process unordered lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        let listItems = [];
        while (
          i < lines.length &&
          (lines[i].startsWith("- ") || lines[i].startsWith("* "))
        ) {
          const itemText = lines[i].slice(2);
          // Process inline formatting
          let processed = itemText
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(
              /`([^`]+)`/g,
              '<code class="bg-slate-800 px-1 rounded text-slate-100 text-xs">$1</code>',
            );
          listItems.push(`<li class="ml-4 my-1">${processed}</li>`);
          i++;
        }
        output.push(`<ul class="list-disc my-3">${listItems.join("")}</ul>`);
        continue;
      }

      // Process ordered lists
      if (/^\d+\. /.test(line)) {
        let listItems = [];
        while (i < lines.length && /^\d+\. /.test(lines[i])) {
          const itemText = lines[i].replace(/^\d+\. /, "");
          let processed = itemText
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(
              /`([^`]+)`/g,
              '<code class="bg-slate-800 px-1 rounded text-slate-100 text-xs">$1</code>',
            );
          listItems.push(`<li class="ml-4 my-1">${processed}</li>`);
          i++;
        }
        output.push(`<ol class="list-decimal my-3">${listItems.join("")}</ol>`);
        continue;
      }

      // Process paragraphs
      if (line.trim()) {
        let processed = line
          .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/__\(.*?\)__/g, "<u>$1</u>");
        output.push(`<p class="my-3 leading-relaxed">${processed}</p>`);
      }

      i++;
    }

    return output.join("\n");
  };

  return (
    <div className="max-w-6xl">
      <h2 className="text-3xl font-light mb-8 tracking-tight text-slate-900 dark:text-slate-50">
        Create New Post
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Slug Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-light mb-2 text-slate-900 dark:text-slate-50 tracking-wide uppercase">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="input-field"
              placeholder="Your post title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-light mb-2 text-slate-900 dark:text-slate-50 tracking-wide uppercase">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="input-field"
              placeholder="post-slug"
              required
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-light mb-2 text-slate-900 dark:text-slate-50 tracking-wide uppercase">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="textarea-field"
            rows={2}
            placeholder="Brief summary of your post (optional)"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-light mb-2 text-slate-900 dark:text-slate-50 tracking-wide uppercase">
            Cover Image
          </label>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                  <span className="text-sm font-light text-slate-600 dark:text-slate-400">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {coverImageUrl && (
              <div className="space-y-2">
                <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                  <Image
                    src={coverImageUrl}
                    alt={coverImageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light mb-1 text-slate-600 dark:text-slate-400">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={coverImageAlt}
                    onChange={(e) => setCoverImageAlt(e.target.value)}
                    className="input-field text-sm"
                    placeholder="Description of the image"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCoverImageUrl("");
                    setCoverImageAlt("");
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-light mb-2 text-slate-900 dark:text-slate-50 tracking-wide uppercase">
            Tags
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="input-field"
                placeholder="Type tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-secondary px-6"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded text-sm flex items-center gap-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex gap-4 mb-2">
            <label className="block text-sm font-light text-slate-900 dark:text-slate-50 tracking-wide uppercase">
              Content *
            </label>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`text-xs px-3 py-1 rounded transition ${
                  viewMode === "edit"
                    ? "bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`text-xs px-3 py-1 rounded transition ${
                  viewMode === "preview"
                    ? "bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {viewMode === "edit" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea-field font-mono text-sm"
              rows={20}
              placeholder="# Your content here...

Write in Markdown format. Examples:

## Headings
# H1 Heading
## H2 Heading  
### H3 Heading

## Formatting
**bold text** or *italic text* or ***bold italic***

## Lists
- Item 1
- Item 2
- Item 3

1. First item
2. Second item
3. Third item

## Code
\`inline code\`

\`\`\`
code block
multiple lines
\`\`\`

## Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Blockquotes
> This is a blockquote

## Images
![Alt text](https://example.com/image.jpg)

## Links
[Link text](https://example.com)"
              required
            />
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded p-8 bg-slate-50 dark:bg-slate-950 min-h-96 max-h-96 overflow-y-auto prose dark:prose-invert max-w-none text-slate-900 dark:text-slate-50">
              {content ? (
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(content),
                  }}
                />
              ) : (
                <p className="text-slate-400">
                  Your preview will appear here...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded">
          <input
            type="checkbox"
            id="publish"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 cursor-pointer"
          />
          <label
            htmlFor="publish"
            className="font-light text-slate-900 dark:text-slate-50 cursor-pointer"
          >
            Publish immediately (if unchecked, post will be saved as draft)
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
