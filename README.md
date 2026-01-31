# Draftly

Draftly is a modern, dynamic blogging platform built with **Next.js 16**, **Convex**, and **Better Auth**. It features a seamless reading experience, real-time updates, and a robust content management system.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Graphic Overview

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend & Database**: Convex (Real-time database, backend functions, file storage)
- **Authentication**: Better Auth
- **UI Components**: Shadcn UI, Lucide React
- **Type Safety**: TypeScript, Zod

## ✨ Features

- **📖 Browse Articles**: View a list of blog posts with optimized image loading and caching.
- **✍️ Create Posts**: Rich text content creation (Markdown/Text) with image uploads.
- **🔍 Search**: Instant search functionality for posts (title and content).
- **💬 Comments**: Engage with content through a commenting system.
- **⚡ Real-time**: leveraged by Convex for immediate data updates.
- **🎨 Modern UI**: Clean, responsive design using Tailwind CSS and simplified layout/theming.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Convex](https://www.convex.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [Shadcn UI](https://ui.shadcn.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+ recommended)
- npm, pnpm, or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/SafiMaaz01/draftly.git
    cd draftly
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Convex Configuration (Get these from your Convex dashboard)
    CONVEX_DEPLOYMENT=dev:your-deployment-name
    NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
    NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment-name.convex.site

    # Authentication
    BETTER_AUTH_SECRET=your_generated_secret_key

    # App URL
    SITE_URL=http://localhost:3000
    ```

4.  **Start Convex Dev Server**
    Run the Convex development server to sync your schema and functions.

    ```bash
    npx convex dev
    ```

5.  **Run the Application**
    Open a new terminal and start the Next.js development server.

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
draftly/
├── app/                  # Next.js App Router pages and layouts
│   ├── (shared-layout)/  # Layouts shared across main pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── actions.ts        # Server actions
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives
│   └── web/              # App-specific components (Navbar, etc.)
├── convex/               # Convex backend (schema, functions, auth)
├── lib/                  # Utility functions and shared logic
├── public/               # Static assets
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
