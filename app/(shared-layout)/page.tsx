import { HomePageWithAuth } from "@/components/web/HomePageWithAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draftly - Your Space for Ideas",
  description:
    "Discover insightful articles, share your thoughts, and join a community of passionate writers and readers.",
  keywords: ["blog", "articles", "writing", "community", "draftly", "ideas"],
  authors: [{ name: "Draftly Team" }],
  openGraph: {
    title: "Draftly - Your Space for Ideas",
    description:
      "Discover insightful articles, share your thoughts, and join a community of passionate writers and readers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftly - Your Space for Ideas",
    description:
      "Discover insightful articles, share your thoughts, and join a community of passionate writers and readers.",
  },
  robots: { index: true, follow: true },
};

export default function Home() {
  return <HomePageWithAuth />;
}
