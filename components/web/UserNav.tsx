"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Trash2,
  FileText,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

export function UserNav() {
  const router = useRouter();
  const session = authClient.useSession();
  const userId = session.data?.user?.id;
  const profile = useQuery(api.users.getProfile, userId ? { userId } : "skip");

  const user = session.data?.user;
  const deleteAccount = useMutation(api.users.deleteUserAccount);

  const avatarUrl =
    profile?.avatarUrl ||
    user?.image ||
    `https://avatar.vercel.sh/${user?.name || "user"}`;
  const displayName = profile?.displayName || user?.name || "User";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action is permanent and will delete all your posts and data.",
      )
    ) {
      try {
        await deleteAccount();
        // After backend cleanup, we sign out
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Account deleted successfully");
              router.push("/");
              router.refresh();
            },
          },
        });
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/create"
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText className="size-4" />
              <span>New Post</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/bookmarks"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Bookmark className="size-4" />
              <span>Saved Articles</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
          onClick={handleDeleteAccount}
        >
          <Trash2 className="size-4" />
          <span>Delete Account</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
