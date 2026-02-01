import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { Metadata } from "next";
import { Tag, Sparkles } from "lucide-react";
import { PaginatedBlogList } from "@/components/web/PaginatedBlogList";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface TagPageProps {
  params: Promise<{
    tagName: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tagName } = await params;
  const title = `Posts tagged #${tagName}`;
  const description = `Browse all articles tagged with ${tagName} on Draftly.`;
  return {
    title,
    description,
    keywords: ["tag", "draftly", tagName, "articles", "blog"],
    openGraph: {
      title: `${title} | Draftly`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | Draftly`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagName } = await params;

  return (
    <div className="py-12 space-y-12">
      <header className="text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Tag className="size-4" />
          Topic Explorer
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Articles Tagged{" "}
          <span className="text-primary text-lowercase">#{tagName}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          Discover all the stories and insights shared under the #{tagName} tag.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <PaginatedBlogList tag={tagName} />
      </div>
    </div>
  );
}
