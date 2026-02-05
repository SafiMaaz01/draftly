# Draftly

**Draftly** is a modern, real-time blogging platform where users can read articles, write and publish posts, save bookmarks, comment, and like content. The app shows blog content only to signed-in users on the home page and uses **Next.js 16**, **Convex**, and **Better Auth** for a full-stack, type-safe experience.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSafiMaaz01%2Fdraftly)

---

## 📸 Screenshots

<div align="center">
  <img src="https://placehold.co/1200x800?text=Dashboard+Preview" alt="Dashboard Preview" width="800" />
</div>

> _Add your application screenshots here_

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Data Flow: Backend to Frontend](#-data-flow-backend-to-frontend)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Metadata & SEO](#-metadata--seo)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Home (auth-gated)** – Hero, “Welcome back” strip with quick links, recent articles and trending sidebar only when logged in; guests see a sign-in CTA.
- **Blog** – Paginated list of published articles with category/tag filters and search.
- **Post view** – Full article with comments, likes, bookmarks, presence, and related posts (requires login).
- **Create / Edit** – Rich-text editor (TipTap) with image upload, categories, tags, and publish/draft.
- **Dashboard** – Manage your posts (edit, delete, view stats).
- **Saved (Bookmarks)** – Reading list of bookmarked articles.
- **User profiles** – Public profile page with bio, social links, and author’s articles.
- **Tags** – Browse posts by tag.
- **Auth** – Email/password sign-up and login via Better Auth; Convex stores session and user data.
- **Real-time** – Convex subscriptions for live updates (comments, presence, list data).
- **Theme** – Light/dark mode with next-themes.

---

## 🛠 Tech Stack

| Layer                  | Technology                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**          | [Next.js 16](https://nextjs.org/) (App Router)                                                                                                          |
| **UI**                 | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix), [Lucide](https://lucide.dev/) |
| **Backend & DB**       | [Convex](https://www.convex.dev/) (queries, mutations, real-time, file storage)                                                                         |
| **Auth**               | [Better Auth](https://www.better-auth.com/) + [@convex-dev/better-auth](https://www.npmjs.com/package/@convex-dev/better-auth)                          |
| **Forms & validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers)      |
| **Rich text**          | [TipTap](https://tiptap.dev/) (headless editor), [Lowlight](https://github.com/wooorm/lowlight) for code blocks                                         |
| **Animations**         | [Framer Motion](https://www.framer.com/motion/)                                                                                                         |
| **Notifications**      | [Sonner](https://sonner.emilkowal.ski/) (toast)                                                                                                         |
| **Language**           | [TypeScript](https://www.typescriptlang.org/)                                                                                                           |

---

## 🔄 Data Flow: Backend to Frontend

### Overview

- **Backend**: Convex provides the database, serverless functions (queries/mutations), file storage, and real-time subscriptions. Better Auth runs via Convex’s HTTP adapter and stores users/sessions in Convex.
- **Frontend**: Next.js server components use Convex’s `fetchQuery`/`preloadQuery`/`fetchMutation` with a session token from Better Auth. Client components use Convex React (`useQuery`, `useMutation`) and `useConvexAuth()` for auth state. Server Actions call Convex mutations (with `getToken()`) for create/update/delete post and image upload.

### 1. Convex backend (`convex/`)

- **Schema** (`schema.ts`) – Tables: `posts`, `comments`, `likes`, `bookmarks`, `categories`, `userProfiles`. Indexes for listing by author, category, published, trending, etc.
- **Auth** (`auth.ts`, `auth.config.ts`) – Better Auth + Convex adapter; `getCurrentUser` query for the authenticated user.
- **Posts** (`posts.ts`) – Queries: `getPostById`, `getLatestPosts`, `getFeaturedPosts`, `getTrendingPosts`, `getPostsPaginated`, `getPostsByAuthor`, `getMyPosts`, `searchPosts`. Mutations: `createPost`, `updatePost`, `deletePost`, `incrementViewCount`. Storage: `generateImageUploadUrl`.
- **Comments** (`comments.ts`) – `getCommentsByPostId`, `addComment`, etc.
- **Likes** (`likes.ts`) – Toggle like, get like status/count.
- **Bookmarks** (`bookmarks.ts`) – `getUserBookmarks`, `toggleBookmark`, `getBookmarkStatus`.
- **Users** (`users.ts`) – `getProfile`, `updateProfile`, `deleteUserAccount`.
- **Presence** (`presence.ts`) – Who’s viewing a post (Convex presence).
- **HTTP** (`http.ts`) – Better Auth routes (e.g. sign-in, sign-up, session) exposed to the Next.js API route.

Data is read/written only through Convex functions; there is no direct DB access from the Next app.

### 2. Next.js server (App Router)

- **Root layout** – Wraps the app with `ConvexClientProvider` (and `initialToken` from layout/providers if used). Renders `children` inside a shared main container.
- **Auth token** – `lib/auth-server.ts` uses `@convex-dev/better-auth/nextjs` and exports `getToken()`. Server components and Server Actions call `await getToken()` and pass `{ token }` to Convex’s `fetchQuery`/`fetchMutation` so Convex can resolve the current user.
- **Server components** – Fetch data with `fetchQuery(api.*, args, { token })` or `preloadQuery` for streaming. Examples:
  - Blog post page: `fetchQuery(api.posts.getPostById, { postId })`, `preloadQuery(api.comments.getCommentsByPostId, { postId })`, `fetchQuery(api.presence.getUserId, {}, { token })`.
  - User profile: `fetchQuery(api.users.getProfile, { userId }, { token })`, `fetchQuery(api.posts.getPostsByAuthor, { authorId, limit }, { token })`.
  - Edit post: `fetchQuery(api.posts.getPostById, { postId }, { token })`, `fetchQuery(api.auth.getCurrentUser, {}, { token })` to enforce ownership.
- **generateMetadata** – Same `fetchQuery` (and optionally `getToken()`) is used to build page metadata (e.g. post title, user name) for SEO.

So: **server-side data flow = getToken() → fetchQuery/fetchMutation(api.\*, args, { token }) → Convex runs query/mutation with auth context.**

### 3. Next.js client (React)

- **Convex provider** – `ConvexBetterAuthProvider` (from `@convex-dev/better-auth/react`) wraps the app and syncs Better Auth session with Convex (e.g. `initialToken`). Client components use `useConvexAuth()` and Convex React hooks.
- **Auth state** – `useConvexAuth()` returns `{ isAuthenticated, isLoading }`. Used in Navbar (show Login/Sign up vs UserNav) and in `HomePageWithAuth` (show blogs vs guest CTA).
- **Reading data** – `useQuery(api.posts.getLatestPosts, { limit: 6 })`, `useQuery(api.bookmarks.getUserBookmarks)`, etc. Convex pushes updates in real time.
- **Writing data** – `useMutation(api.likes.toggleLike, { postId })`, `useMutation(api.bookmarks.toggleBookmark, { postId })`. No manual refetch; Convex updates the reactive queries.
- **Server Actions for posts** – Create/update/delete post and image upload are done in `app/actions.ts`:
  1. `getToken()` for auth.
  2. Optional image: `fetchMutation(api.posts.generateImageUploadUrl, {}, { token })` → `fetch(uploadUrl, { method: "POST", body: file })` → get `storageId`.
  3. `fetchMutation(api.posts.createPost, { title, content, imageStorageId, ... }, { token })` (or `updatePost`/`deletePost`).
  4. `revalidatePath` and `redirect` for navigation.

So: **client-side data flow = useConvexAuth() + useQuery/useMutation(api.\*) for real-time UI; form submissions → Server Action → getToken() + fetchMutation → Convex.**

### 4. Auth flow (login/sign-up)

- User submits credentials on `/auth/login` or `/auth/sign-up` (client forms using `authClient` from `lib/auth-client.ts`).
- Better Auth API (via Convex HTTP) validates and creates/updates session; Convex stores session/user.
- Next.js receives cookies; `getToken()` in server code and Convex provider on the client read the same session, so Convex queries/mutations see the authenticated user.

### 5. File storage

- Post images: Server Action gets an upload URL from `api.posts.generateImageUploadUrl` (with token), uploads the file to Convex storage, then passes the returned `storageId` into `createPost`/`updatePost`. Convex resolves storage IDs to URLs in queries (e.g. `getPostById`).

---

## 📂 Project Structure

```
draftly/
├── app/
│   ├── layout.tsx                 # Root layout, metadata, ConvexClientProvider, theme
│   ├── globals.css
│   ├── actions.ts                  # Server Actions: create/update/delete post, image upload
│   ├── schemas/
│   │   ├── auth.ts                 # Zod: login, signUp
│   │   ├── blog.ts                 # Zod: postSchema
│   │   └── comment.ts
│   ├── (shared-layout)/            # Main app layout (navbar + children)
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Home (HomePageWithAuth)
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog list
│   │   │   ├── [postId]/           # Post detail, comments, presence, related
│   │   │   └── edit/[postId]/      # Edit post (owner only)
│   │   ├── create/page.tsx         # New post
│   │   ├── dashboard/page.tsx      # My posts
│   │   ├── bookmarks/page.tsx      # Saved articles
│   │   └── user/[userId]/page.tsx  # Public user profile
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── sign-up/page.tsx
│   ├── tags/[tagName]/page.tsx     # Posts by tag
│   └── api/auth/[...all]/route.ts  # Better Auth API → Convex HTTP
├── components/
│   ├── ui/                         # shadcn primitives (button, card, form, etc.)
│   └── web/                        # App components (Navbar, HomePage, PostForm, etc.)
├── convex/
│   ├── schema.ts                   # Tables and indexes
│   ├── auth.ts, auth.config.ts     # Better Auth + Convex
│   ├── posts.ts, comments.ts, likes.ts, bookmarks.ts, users.ts, presence.ts, categories.ts
│   ├── http.ts                     # Auth HTTP routes
│   └── _generated/                 # Convex generated API and types
├── lib/
│   ├── auth-client.ts              # Better Auth client (browser)
│   ├── auth-server.ts              # getToken, handler for API route
│   └── utils.ts
└── public/
    └── favicon.ico
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. **Clone and install**

   ```bash
   git clone https://github.com/SafiMaaz01/draftly.git
   cd draftly
   pnpm install
   ```

2. **Convex**
   - Sign up at [convex.dev](https://www.convex.dev) and link the project: `npx convex dev` (creates project if needed).
   - Note the deployment URL and site URL from the Convex dashboard or CLI.

3. **Environment variables**

   Create `.env.local` in the project root (see [Environment Variables](#-environment-variables)).

4. **Run Convex and Next.js**

   ```bash
   npx convex dev
   ```

   In another terminal:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Environment Variables

| Variable                      | Description                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL`      | Convex deployment URL (e.g. `https://xxx.convex.cloud`).                        |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Site URL Convex uses for auth (e.g. `http://localhost:3000` or production URL). |
| `SITE_URL`                    | Same as app origin (used by Better Auth; e.g. `http://localhost:3000`).         |
| `NEXT_PUBLIC_APP_URL`         | Optional; used as `metadataBase` fallback for SEO.                              |

Convex secrets (e.g. for Better Auth) are set in the Convex dashboard or via `npx convex env set ...`.

---

## 📄 Metadata & SEO

- **Root layout** (`app/layout.tsx`) – Default title and template `%s | Draftly`, description, keywords, `metadataBase`, `openGraph`, `twitter`, `robots`, `applicationName`, `icons`, `referrer`.
- **Routes** – Each major route (or its layout) exports `metadata` or `generateMetadata`:
  - Home, Blog, Create, Dashboard, Bookmarks, Login, Sign up: static or layout metadata.
  - Post detail: `generateMetadata` from `getPostById` (title, description, OG image, Twitter card).
  - User profile: `generateMetadata` from `getProfile` / `getPostsByAuthor` (name, bio).
  - Tag: `generateMetadata` with tag name.
  - Edit post: `generateMetadata` with post title (auth required).

This gives consistent, crawlable metadata and good sharing previews across the app.

---

## 🤝 Contributing

Contributions are welcome. Open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
