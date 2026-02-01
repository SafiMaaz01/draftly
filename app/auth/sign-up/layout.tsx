import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a Draftly account to publish articles, save your favorites, and join the community.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Sign up | Draftly",
    description: "Create your Draftly account and start writing.",
    type: "website",
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
