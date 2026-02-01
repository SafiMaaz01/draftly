"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () =>
    import("@/components/ui/rich-text-editor").then(
      (mod) => mod.RichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />
    ),
  },
);
import { useState, useTransition } from "react";
import {
  Loader2,
  Sparkles,
  ImagePlus,
  Tag,
  X,
  FolderOpen,
  Save,
} from "lucide-react";
import { CategoryBadge } from "@/components/web/CategoryBadge";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Technology",
  "Design",
  "Development",
  "Business",
  "Lifestyle",
  "Productivity",
  "Tutorial",
  "News",
];

type PostFormValues = {
  title: string;
  content: string;
  category: string;
  tags: string[];
  image?: File;
  published: boolean;
};

interface PostFormProps {
  initialData?: {
    _id: string;
    title: string;
    content: string;
    category?: string;
    tags?: string[];
    imageUrl?: string | null;
    published?: boolean;
  };
  onSubmit: (values: PostFormValues) => Promise<void>;
  isPending: boolean;
}

export function PostForm({
  initialData,
  onSubmit,
  isPending: externalPending,
}: PostFormProps) {
  const [internalPending, startTransition] = useTransition();
  const isPending = externalPending || internalPending;

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category || "",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      published: initialData?.published || false,
    },
  });

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      form.setValue("tags", updatedTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleFormSubmit = async (data: PostFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <div className="grid gap-8">
          {/* Title */}
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter an eye-catching title..."
                    className="text-lg h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Selection */}
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <FolderOpen className="size-4" />
                  Category
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          field.onChange(cat);
                        }}
                        className={cn(
                          "transition-all duration-200",
                          field.value === cat
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full scale-105"
                            : "opacity-70 hover:opacity-100",
                        )}
                      >
                        <CategoryBadge category={cat} size="md" />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Tag className="size-4" />
              Tags{" "}
              <span className="text-muted-foreground font-normal text-sm">
                (up to 5)
              </span>
            </FormLabel>
            <div className="flex gap-2 mt-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag and press Enter..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm group"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormItem>

          {/* Content (Rich Text) */}
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Content
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Write your article content here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <ImagePlus className="size-4" />
                  Cover Image
                </FormLabel>
                <FormControl>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              field.onChange(undefined);
                              setImagePreview(null);
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                        <ImagePlus className="size-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload cover image
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            field.onChange(file);
                            handleImageChange(file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            name="published"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-semibold">
                    Publish Status
                  </FormLabel>
                  <FormDescription>
                    When enabled, your article will be visible to everyone.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isPending}
              onClick={() => {
                form.setValue("published", false);
                form.handleSubmit(handleFormSubmit)();
              }}
            >
              {isPending && !form.getValues("published") ? (
                <Loader2 className="size-5 animate-spin mr-2" />
              ) : (
                <Save className="size-5 mr-2" />
              )}
              Save as Draft
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-1"
              disabled={isPending}
              onClick={() => {
                form.setValue("published", true);
                form.handleSubmit(handleFormSubmit)();
              }}
            >
              {isPending && form.getValues("published") ? (
                <Loader2 className="size-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="size-5 mr-2" />
              )}
              {initialData ? "Update Article" : "Publish Article"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
