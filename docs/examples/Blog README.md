# Kps Blog

## ✨ Features

### 📝 Blog System

- Create, edit, delete, publish/unpublish blog posts from the dashboard
- **Cover image upload** — upload from your laptop or paste a URL
- Markdown-style content with tags
- SEO-friendly slugs auto-generated from titles
- Public blog listing with individual post pages
- Unpublished drafts only visible to admin

### 🖼️ Image Upload

- Upload cover images directly from your device (JPEG, PNG, GIF, WebP, AVIF)
- Max 5MB per image
- Stored in **Supabase Storage** (public `covers` bucket)
- Live preview before publishing
- Fallback to paste URL (e.g. Unsplash)

### 🔐 Authentication & Authorization

- **Clerk** handles sign-in / sign-up 
- **Admin role** — only `02230287.cst@rub.edu.bt` can create, edit, and delete content
- **Everyone else** — read-only access to published posts
- Admin detected by email address + optional Clerk user ID shortcut

### 🛡️ Security

- **Supabase Row Level Security (RLS)** — anon key can only SELECT published posts
- **Service role key** (server-side only) — bypasses RLS for admin writes & uploads
- **Clerk middleware** — protects `/dashboard` route, requires sign-in
- **API route guards** — every write endpoint checks `isAdmin()` before executing
- No secrets exposed to the client

### 📊 Admin Dashboard

- **Overview** — stats (total posts, published, drafts, tags) + recent posts table
- **Create** — full post editor with title, excerpt, content, image upload, tags
- **Manage** — edit, publish/unpublish, delete posts with one click
- Profile card with admin/reader badge
- Toast notifications for all actions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- [Clerk](https://clerk.com) account (free tier works)
- [Supabase](https://supabase.com) project (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/kinley-pal8/blog-portfolio.git
cd blog-portfolio

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Fill in your values (see Environment Variables section below)
```

### Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
2. Paste the contents of `supabase-setup.sql` and click **Run**
3. This creates the `posts` table with proper RLS policies and a `covers` storage bucket

### Development

```bash
npm run dev
```

Opens at **http://localhost:3000**

### Production Build

```bash
npm run build
npm run start
```

---

## 🔑 Environment Variables

| Variable                            | Where to get it                                                       | Public?   |
| ----------------------------------- | --------------------------------------------------------------------- | --------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys             | ✅ Yes    |
| `CLERK_SECRET_KEY`                  | Clerk Dashboard → API Keys                                            | ❌ Secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | Set to `/sign-in`                                                     | ✅ Yes    |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | Set to `/sign-up`                                                     | ✅ Yes    |
| `ADMIN_USER_ID`                     | Clerk Dashboard → Users → click your user → copy ID                   | ❌ Secret |
| `NEXT_PUBLIC_SUPABASE_URL`          | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API | ✅ Yes    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase Dashboard → Settings → API → `anon` key                      | ✅ Yes    |
| `SUPABASE_SERVICE_ROLE_KEY`         | Supabase Dashboard → Settings → API → `service_role` key              | ❌ Secret |

> ⚠️ **Never commit `.env`** — it's gitignored. Use `.env.example` as a template.

---

## 🏗️ Architecture

```
blog-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with ClerkProvider
│   │   ├── page.tsx                # Home — hero, recent posts, about, tech stack
│   │   ├── globals.css             # Cyberpunk theme styles
│   │   ├── api/
│   │   │   ├── admin/route.ts      # GET /api/admin — check if current user is admin
│   │   │   ├── posts/route.ts      # GET (list) / POST (create) posts
│   │   │   ├── posts/[id]/route.ts # PUT (update) / DELETE posts
│   │   │   └── upload/route.ts     # POST /api/upload — image upload to Supabase Storage
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing (public)
│   │   │   └── [slug]/page.tsx     # Individual blog post (public)
│   │   ├── dashboard/page.tsx      # Admin dashboard (create/manage/upload)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── components/
│   │   ├── Header.tsx              # Nav with Clerk auth buttons
│   │   ├── Footer.tsx              # Links to GitHub, LinkedIn, Facebook
│   │   └── BlogCard.tsx            # Post preview card
│   ├── lib/
│   │   ├── auth.ts                 # isAdmin() — email + user ID check
│   │   ├── supabase.ts             # Supabase clients (anon + service_role)
│   │   └── blog-data.ts            # Post CRUD (reads via anon, writes via admin client)
│   └── middleware.ts               # Clerk middleware — protects /dashboard
├── supabase-setup.sql              # Database schema + RLS policies + storage bucket
├── .env.example                    # Template for environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

### Data Flow

```
User → Clerk Auth → Next.js Middleware → Page/API Route
                                              ↓
                                      isAdmin() check
                                         ↓         ↓
                                      Admin       Reader
                                         ↓         ↓
                                   supabaseAdmin  supabase (anon)
                                   (service_role)  (RLS: SELECT only)
                                         ↓         ↓
                                      Supabase Database + Storage
```

### Security Model

| Layer                | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| **Clerk Middleware** | Requires sign-in for `/dashboard`                           |
| **API Route Guards** | Every POST/PUT/DELETE checks `isAdmin()` → 403 if not admin |
| **isAdmin()**        | Matches Clerk email to `02230287.cst@rub.edu.bt`            |
| **Supabase RLS**     | Anon key can only SELECT published posts                    |
| **Service Role Key** | Server-side only, bypasses RLS for admin writes + uploads   |

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add all environment variables (see table above)
4. Deploy — that's it

### Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add each variable from the table above.

---

## ⬇️ Dependencies

### Runtime

- **next** (16.1.6): React framework with App Router
- **react** / **react-dom** (19.2.3): UI library
- **@clerk/nextjs** (^6.39.0): Authentication
- **@clerk/themes** (^2.4.57): Dark theme for Clerk components
- **@supabase/supabase-js** (^2.98.0): Database client + Storage

### Development

- **typescript** (^5): Type safety
- **tailwindcss** (^4): Utility-first CSS
- **eslint** + **eslint-config-next**: Linting

---
