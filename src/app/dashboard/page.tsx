"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CreatePostForm from "@/components/CreatePostForm";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "create" | "manage" | "users"
  >("overview");

  if (!isLoaded) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="space-y-8 pt-24 pb-20 max-w-7xl mx-auto px-8 transition-colors duration-300">
      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-light">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-light border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 px-0 font-light text-sm tracking-wide uppercase transition ${
            activeTab === "overview"
              ? "border-b-2 border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-50"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`pb-4 px-0 font-light text-sm tracking-wide uppercase transition ${
            activeTab === "create"
              ? "border-b-2 border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-50"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Create Post
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`pb-4 px-0 font-light text-sm tracking-wide uppercase transition ${
            activeTab === "manage"
              ? "border-b-2 border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-50"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Manage Posts
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-4 px-0 font-light text-sm tracking-wide uppercase transition ${
            activeTab === "users"
              ? "border-b-2 border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-50"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Users
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "create" && <CreatePostForm />}
        {activeTab === "manage" && <ManagePostsTab />}
        {activeTab === "users" && <UsersTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalTags: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/posts?admin=true");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-light mb-12 tracking-tight text-slate-900 dark:text-slate-50">
        Blog Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-light text-sm">
            Total Posts
          </p>
          <p className="text-5xl font-light text-slate-900 dark:text-slate-50">
            {stats.totalPosts}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-light text-sm">
            Published
          </p>
          <p className="text-5xl font-light text-slate-900 dark:text-slate-50">
            {stats.publishedPosts}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-light text-sm">
            Drafts
          </p>
          <p className="text-5xl font-light text-slate-900 dark:text-slate-50">
            {stats.draftPosts}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-light text-sm">
            Tags
          </p>
          <p className="text-5xl font-light text-slate-900 dark:text-slate-50">
            {stats.totalTags}
          </p>
        </div>
      </div>
    </div>
  );
}

function ManagePostsTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts?admin=true");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        alert("Post deleted!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  async function togglePublish(id: string, published: boolean) {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPosts(posts.map((p) => (p.id === id ? updated : p)));
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  function startEdit(post: any) {
    setEditingId(post.id);
    setEditForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags || [],
    });
  }

  async function saveEdit() {
    if (!editingId) return;

    try {
      const res = await fetch(`/api/posts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const updated = await res.json();
        setPosts(posts.map((p) => (p.id === editingId ? updated : p)));
        setEditingId(null);
        alert("Post updated successfully!");
      } else {
        alert("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  if (loading)
    return (
      <div className="text-slate-600 dark:text-slate-400">Loading posts...</div>
    );

  return (
    <div>
      <h2 className="text-3xl font-light mb-12 tracking-tight text-slate-900 dark:text-slate-50">
        Manage Posts
      </h2>
      {posts.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">No posts yet</p>
      ) : (
        <>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left py-4 px-6 font-light text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">
                    Title
                  </th>
                  <th className="text-left py-4 px-6 font-light text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">
                    Author
                  </th>
                  <th className="text-left py-4 px-6 font-light text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-light text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">
                    Date
                  </th>
                  <th className="text-right py-4 px-6 font-light text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-900 dark:text-slate-50">
                      {post.title}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {post.author_email || "Unknown"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-light tracking-wide ${
                          post.published
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-slate-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {post.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-4">
                      <button
                        onClick={() => startEdit(post)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 text-xs font-light tracking-wide uppercase transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => togglePublish(post.id, post.published)}
                        className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-light tracking-wide uppercase transition-colors"
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-light tracking-wide uppercase transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {editingId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-8">
                <h3 className="text-2xl font-light mb-6 text-slate-900 dark:text-slate-50">
                  Edit Post
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-slate-700 dark:text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-slate-700 dark:text-slate-300 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editForm.slug || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, slug: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-slate-700 dark:text-slate-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={editForm.excerpt || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, excerpt: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-slate-700 dark:text-slate-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={editForm.content || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, content: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-mono text-xs"
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={saveEdit}
                      className="flex-1 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded font-light tracking-wide uppercase text-sm transition-colors hover:bg-slate-800 dark:hover:bg-slate-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded font-light tracking-wide uppercase text-sm transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users?all=true");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="text-slate-600 dark:text-slate-400">Loading users...</div>
    );

  return (
    <div>
      <h2 className="text-3xl font-light mb-12 tracking-tight text-slate-900 dark:text-slate-50">
        Authenticated Users
      </h2>

      {users.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">
          No users registered yet
        </p>
      ) : (
        <div className="grid gap-6">
          {users.map((user) => (
            <div key={user.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.profile_image_url && (
                    <img
                      src={user.profile_image_url}
                      alt={user.full_name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                      {user.full_name || "Unknown User"}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-slate-600 dark:text-slate-400 font-light">
                    Joined
                  </p>
                  <p className="text-slate-900 dark:text-slate-50 font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
