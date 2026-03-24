"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
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
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-20 slide-in-up">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter text-slate-900 dark:text-slate-50">
          USERS
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light">
          {users.length === 0
            ? "No users registered yet"
            : `${users.length} user${users.length !== 1 ? "s" : ""} registered`}
        </p>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 font-light">
            No users have registered yet.
          </p>
          <Link href="/sign-up" className="btn-primary">
            Be the First to Join
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user, index) => (
            <div
              key={user.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="card slide-in-up"
            >
              <div className="flex flex-col items-center text-center">
                {user.profile_image_url && (
                  <img
                    src={user.profile_image_url}
                    alt={user.full_name}
                    className="w-20 h-20 rounded-full mb-4 border-2 border-slate-200 dark:border-slate-700"
                  />
                )}
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                  {user.full_name || "User"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 break-all">
                  {user.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-light">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      {users.length > 0 && (
        <div className="mt-20 card text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            Join Our Community
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 font-light">
            Be part of our growing community of users
          </p>
          <Link href="/sign-up" className="btn-primary">
            Sign Up Now
          </Link>
        </div>
      )}
    </div>
  );
}
