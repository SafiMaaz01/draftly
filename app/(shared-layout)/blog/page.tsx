import { Metadata } from "next";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { CategoryBadge } from "@/components/web/CategoryBadge";
import { Sparkles, Filter } from "lucide-react";
import { PaginatedBlogList } from "@/components/web/PaginatedBlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Discover insightful articles, tutorials, and stories from our community of writers and readers.",
  category: "blog",
  authors: [{ name: "Draftly Team" }],
  creator: "Draftly",
  publisher: "Draftly",
  robots: { index: true, follow: true },
  keywords: ["blog", "articles", "insights", "draftly", "tutorials", "stories", "community"],
  openGraph: {
    title: "Blog | Draftly",
    description:
      "Discover insightful articles, tutorials, and stories from our community.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Draftly",
    description:
      "Discover insightful articles, tutorials, and stories from our community.",
  },
};

export default async function BlogPage() {
  const token = await getToken();
  if (!token) {
    redirect("/auth/login?callbackUrl=/blog");
  }

  return (
    <div className="py-12 space-y-12">
      {/* Hero Header */}
      <header className="text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="size-4" />
          Explore Our Articles
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          The <span className="text-primary">Draftly</span> Blog
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, tutorials, stories, and ideas from writers around the world
        </p>
      </header>

      {/* Filter / Categories Bar */}
      <div className="flex items-center justify-center gap-3 flex-wrap animate-in fade-in slide-in-from-bottom duration-500 delay-150">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="size-4" />
          Popular topics:
        </span>
        {["Technology", "Design", "Development", "Business", "Lifestyle"].map(
          (cat) => (
            <CategoryBadge
              key={cat}
              category={cat}
              size="md"
              className="cursor-pointer hover:scale-105 transition-transform"
            />
          ),
        )}
      </div>

      {/* Blog Grid */}
      <PaginatedBlogList />
    </div>
  );
}
