import { Metadata } from "next";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Article",
  description:
    "Write a new article and share your ideas with the Draftly community. Rich text editor with image uploads.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Create Article | Draftly",
    description:
      "Write a new article and share your ideas with the Draftly community.",
    type: "website",
  },
};

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) {
    redirect("/auth/login?callbackUrl=/create");
  }
  return <>{children}</>;
}
