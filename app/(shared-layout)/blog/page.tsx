import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
// import { connection } from "next/server";
import { Suspense } from "react";

// // 'auto' | 'force-dynamic' | 'error' | 'force-static'
// export const dynamic = "force-static";

// // false | 0 | number
// export const revalidate = 10;

export const metadata: Metadata = {
  title: "Blog",
  description: "Read our latest articles and insights",
  category: "Blog",
  authors: [{ name: "MD SAFI MAAZ" }],
  creator: "MD SAFI MAAZ",
  publisher: "MD SAFI MAAZ",
  robots: "index, follow",
  keywords: ["blog", "articles", "insights", "draftly"],
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, trends and updates from our team
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  // // await connection() is used to cache the data
  // await connection();

  // use cache is to revalidate the data every 15 minutes
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const data = await fetchQuery(api.posts.getPosts);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={
                post.imageUrl ??
                "https://images.unsplash.com/photo-1571369985388-ddb4b4e86bd2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              fill
              className="rounded-t-lg object-cover"
              alt="image"
            />
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h2 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h2>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </CardContent>
          <CardFooter>
            <Link
              href={`/blog/${post._id}`}
              className={buttonVariants({ className: "w-full" })}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div className="flex flex-col space-y-3" key={index}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
