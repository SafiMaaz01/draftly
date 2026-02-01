import { Navbar } from "@/components/web/navbar";
import { Suspense } from "react";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-16 w-full bg-background/80 backdrop-blur-lg border-b animate-pulse" />
        }
      >
        <Navbar />
      </Suspense>
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
}
