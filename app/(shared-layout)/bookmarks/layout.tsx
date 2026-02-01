import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Articles",
  description:
    "Your saved articles and reading list on Draftly. Access your bookmarked posts anytime.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Saved Articles | Draftly",
    description: "Your saved articles and reading list on Draftly.",
    type: "website",
  },
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
