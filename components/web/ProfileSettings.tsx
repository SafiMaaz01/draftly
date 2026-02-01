"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Save,
  Camera,
  Trash2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfileSettings() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const profile = useQuery(api.users.getProfile, userId ? { userId } : "skip");
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.posts.generateImageUploadUrl);

  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    twitter: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        twitter: profile.socialLinks?.twitter || "",
        github: profile.socialLinks?.github || "",
        linkedin: profile.socialLinks?.linkedin || "",
        website: profile.socialLinks?.website || "",
      });
      setImagePreview(profile.avatarUrl || null);
    } else if (session.data?.user) {
      setFormData((prev) => ({
        ...prev,
        displayName: session.data?.user?.name || "",
      }));
      setImagePreview(session.data?.user?.image || null);
    }
  }, [profile, session.data?.user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageStorageId = profile?.imageStorageId;

      if (imageFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        imageStorageId,
        socialLinks: {
          twitter: formData.twitter,
          github: formData.github,
          linkedin: formData.linkedin,
          website: formData.website,
        },
      });
      toast.success("Profile updated successfully!");
      setImageFile(null);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 animate-in fade-in duration-500"
    >
      <Card className="border-border/50 shadow-lg overflow-hidden glass">
        <CardHeader className="bg-primary/5 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Public Profile
          </CardTitle>
          <CardDescription>
            This information will be displayed on your author profile page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-border/50">
            <div className="relative group">
              <Avatar className="size-24 border-4 border-background shadow-xl ring-2 ring-primary/10">
                <AvatarImage src={imagePreview || ""} />
                <AvatarFallback className="text-2xl font-bold bg-primary/5">
                  {formData.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="size-6" />
              </button>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-bold">Profile Picture</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Upload a custom image. PNG, JPG or GIF up to 5MB.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Your name"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little bit about yourself..."
                className="resize-none h-32"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-lg overflow-hidden glass">
        <CardHeader className="bg-primary/5 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            Social Links
          </CardTitle>
          <CardDescription>
            Connect your other profiles to build your brand.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 pt-6">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="size-3 text-muted-foreground" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="size-3 text-muted-foreground" />
              Twitter/X
            </Label>
            <Input
              id="twitter"
              placeholder="@username"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="size-3 text-muted-foreground" />
              GitHub
            </Label>
            <Input
              id="github"
              placeholder="username"
              value={formData.github}
              onChange={(e) =>
                setFormData({ ...formData, github: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="size-3 text-muted-foreground" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="username or profile URL"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
            />
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t border-border/50 py-4 flex justify-end">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
