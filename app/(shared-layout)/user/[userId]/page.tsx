import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Newspaper,
  Calendar,
  Twitter,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RecentPostsGrid } from "@/components/web/HomePage";
import type { Metadata } from "next";

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { userId } = await params;
  const profile = await fetchQuery(api.users.getProfile, { userId });
  const posts = await fetchQuery(api.posts.getPostsByAuthor, {
    authorId: userId,
    limit: 1,
  });
  const name =
    profile?.displayName || posts[0]?.authorName || "Author";
  const description =
    profile?.bio || `Read articles by ${name} on Draftly.`;
  return {
    title: `${name}'s Profile`,
    description,
    openGraph: {
      title: `${name} | Draftly`,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${name} | Draftly`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { userId } = await params;
  const token = await getToken();

  const profile = await fetchQuery(api.users.getProfile, { userId }, { token });
  const posts = await fetchQuery(
    api.posts.getPostsByAuthor,
    { authorId: userId, limit: 100 },
    { token },
  );

  if (!profile && posts.length === 0) {
    // If no profile and no posts, maybe user doesn't exist
    return notFound();
  }

  const name =
    profile?.displayName || posts[0]?.authorName || "Anonymous Writer";
  const bio = profile?.bio || "No bio available.";

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      {/* Profile Header */}
      <section className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent rounded-3xl -z-10" />
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <Avatar className="size-32 md:size-40 border-4 border-background shadow-xl">
            <AvatarImage src={profile?.avatarUrl} alt={name} />
            <AvatarFallback className="text-4xl">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                {bio}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Newspaper className="size-4" />
                <span>{posts.length} Posts</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                <span>Joined {format(new Date(), "MMMM yyyy")}</span>
              </div>
            </div>

            {profile?.socialLinks && (
              <div className="flex justify-center md:justify-start gap-3">
                {profile.socialLinks.twitter && (
                  <Link
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    <Twitter className="size-5" />
                  </Link>
                )}
                {profile.socialLinks.github && (
                  <Link
                    href={profile.socialLinks.github}
                    target="_blank"
                    className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    <Github className="size-5" />
                  </Link>
                )}
                {profile.socialLinks.linkedin && (
                  <Link
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    <Linkedin className="size-5" />
                  </Link>
                )}
                {profile.socialLinks.website && (
                  <Link
                    href={profile.socialLinks.website}
                    target="_blank"
                    className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    <Globe className="size-5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User's Posts */}
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Newspaper className="size-6 text-primary" />
          <h2 className="text-3xl font-bold">Articles by {name}</h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            This user hasn't published any articles yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/blog/${post._id}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={
                        post.imageUrl ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400"
                      }
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.category && (
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant="secondary"
                          className="backdrop-blur-md bg-background/50"
                        >
                          {post.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>

                <CardContent className="p-4 space-y-3">
                  <Link href={`/blog/${post._id}`}>
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.excerpt || "No excerpt available"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <span>
                      {format(new Date(post._creationTime), "MMM d, yyyy")}
                    </span>
                    <span>{post.readingTime || 5} min read</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
