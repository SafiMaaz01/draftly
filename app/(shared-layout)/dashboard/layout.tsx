import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your articles, view stats, and access your Draftly writer dashboard.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Dashboard | Draftly",
    description: "Manage your articles and view your writer stats on Draftly.",
    type: "website",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
