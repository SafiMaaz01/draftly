import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const categoryColors: Record<string, string> = {
  technology:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  design:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  development:
    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  business:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  lifestyle:
    "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  productivity:
    "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  tutorial:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  news: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  default: "bg-primary/10 text-primary border-primary/20",
};

const sizeClasses = {
  sm: "text-[10px] px-2 py-0",
  md: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
};

export function CategoryBadge({
  category,
  className,
  size = "md",
}: CategoryBadgeProps) {
  const colorClass =
    categoryColors[category.toLowerCase()] || categoryColors.default;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-semibold",
        colorClass,
        sizeClasses[size],
        className,
      )}
    >
      {category}
    </Badge>
  );
}

interface TagBadgeProps {
  tag: string;
  className?: string;
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-md font-medium", className)}
    >
      #{tag}
    </Badge>
  );
}
