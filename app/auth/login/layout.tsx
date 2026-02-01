import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Draftly account to read, write, and save articles.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Log in | Draftly",
    description: "Log in to your Draftly account.",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
