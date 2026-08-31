import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Camera, Loader2, Save, User, Sun, Moon, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const ProfileSettings = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Initialize display name when profile loads
  useState(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  });

  // Update display name when profile changes
  if (profile?.display_name && displayName === "" && !isLoading) {
    setDisplayName(profile.display_name);
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const updatedProfile = await apiClient.upload<{ avatar_url: string }>(
        "/api/profiles/me/avatar",
        formData
      );

      // Force re-fetch of profile
      updateProfile({ avatar_url: updatedProfile.avatar_url });

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated.",
      });
    } catch (error: unknown) {
      toast({
        title: "Upload failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Invalid name",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      updateProfile({ display_name: displayName.trim() });
      toast({
        title: "Profile updated!",
        description: "Your profile has been saved.",
      });
    } catch (error: unknown) {
      toast({
        title: "Update failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Avatar Section */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Profile Picture</CardTitle>
              <CardDescription>
                Click on your avatar to upload a new photo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar
                    className="h-24 w-24 cursor-pointer ring-2 ring-border hover:ring-primary transition-all"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage src={profile?.avatar_url ? apiClient.assetUrl(profile.avatar_url) : ""} />
                    <AvatarFallback className="text-2xl">
                      {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={handleAvatarClick}
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="font-medium">{profile?.display_name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Free Plan
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <Separator />

              <Button
                onClick={handleSaveProfile}
                disabled={isUpdating || displayName === profile?.display_name}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>
                Customize how DSA Logic Builder looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
              <CardDescription>
                Details about your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account ID</span>
                <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last sign in</span>
                <span>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileSettings;