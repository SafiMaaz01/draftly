"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { SearchInput } from "./SearchInput";
import {
  Bookmark,
  PenSquare,
  LogOut,
  Menu,
  X,
  Home,
  Newspaper,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserNav } from "./UserNav";

const navLinks = [{ href: "/", label: "Home", icon: Home }];

const authNavLinks = [
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/create", label: "Create", icon: PenSquare },
  { href: "/bookmarks", label: "Saved", icon: Bookmark },
];

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform">
            D
          </div>
          <h1 className="text-2xl font-bold hidden sm:block">
            Draft<span className="text-primary">ly</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2",
                  isActive && "bg-accent text-accent-foreground",
                )}
                href={link.href}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated &&
            authNavLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "gap-2",
                    isActive && "bg-accent text-accent-foreground",
                  )}
                  href={link.href}
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search - Desktop Only */}
          <div className="hidden lg:block">
            <SearchInput />
          </div>

          {/* Auth Buttons */}
          {isLoading ? (
            <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
          ) : isAuthenticated ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                className={buttonVariants({ size: "sm" })}
                href="/auth/login"
              >
                Login
              </Link>
              <Link
                className={buttonVariants({ variant: "outline", size: "sm" })}
                href="/auth/sign-up"
              >
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Join</span>
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-2">
            {/* Mobile Search */}
            <div className="pb-3 border-b border-border mb-3">
              <SearchInput />
            </div>

            {/* Mobile Nav Links */}
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <link.icon className="size-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated &&
              authNavLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    <link.icon className="size-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </nav>
  );
}
