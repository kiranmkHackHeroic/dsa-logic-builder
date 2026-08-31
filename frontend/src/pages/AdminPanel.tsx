import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  BookOpen,
  Target,
  Users,
  Settings,
  Database,
  Tag,
  ShieldX
} from "lucide-react";

const AdminPanel = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const [problems] = useState([
    { id: 1, title: "Two Sum", difficulty: "easy", pattern: "Hash Map", status: "published" },
    { id: 2, title: "Container With Most Water", difficulty: "medium", pattern: "Two Pointers", status: "published" },
    { id: 3, title: "Longest Substring", difficulty: "medium", pattern: "Sliding Window", status: "draft" },
  ]);

  const [patterns] = useState([
    { id: 1, name: "Two Pointers", problems: 24 },
    { id: 2, name: "Sliding Window", problems: 18 },
    { id: 3, name: "Binary Search", problems: 21 },
    { id: 4, name: "Dynamic Programming", problems: 45 },
  ]);

  const isLoading = authLoading || roleLoading;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto">
            <Card variant="elevated" className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <ShieldX className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-muted-foreground mb-6">
                  You don't have permission to access the admin panel. 
                  Only users with admin privileges can view this page.
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Badge variant="accent" className="mb-4">Admin Panel</Badge>
            <h1 className="text-3xl font-bold mb-2">Content Management</h1>
            <p className="text-muted-foreground">
              Manage problems, patterns, and platform content
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">150</p>
                    <p className="text-xs text-muted-foreground">Total Problems</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold">5,234</p>
                    <p className="text-xs text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">45K</p>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="problems" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-xl">
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Problems Tab */}
            <TabsContent value="problems" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Problems</h2>
                <Button variant="hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Problem
                </Button>
              </div>

              {/* Problem List */}
              <Card variant="elevated">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {problems.map((problem) => (
                      <div key={problem.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground font-mono">#{problem.id}</span>
                          <div>
                            <p className="font-medium">{problem.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={problem.difficulty as "easy" | "medium" | "hard"}>
                                {problem.difficulty}
                              </Badge>
                              <Badge variant="secondary">{problem.pattern}</Badge>
                              <Badge variant={problem.status === "published" ? "success" : "warning"}>
                                {problem.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add/Edit Problem Form */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Problem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Problem title..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pattern</label>
                      <Input placeholder="Select pattern..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea placeholder="Problem description..." className="min-h-[100px]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Logic Steps</label>
                    <Textarea placeholder="Define the thinking steps..." className="min-h-[100px]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Common Wrong Assumptions</label>
                    <Textarea placeholder="List common mistakes students make..." className="min-h-[80px]" />
                  </div>
                  <Button variant="hero">
                    <Save className="h-4 w-4 mr-2" />
                    Save Problem
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patterns Tab */}
            <TabsContent value="patterns" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Patterns</h2>
                <Button variant="hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pattern
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {patterns.map((pattern) => (
                  <Card key={pattern.id} variant="interactive">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Tag className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">{pattern.name}</p>
                            <p className="text-sm text-muted-foreground">{pattern.problems} problems</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    User management features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Platform Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default Time Limit (Interview Mode)</label>
                    <Input type="number" defaultValue="45" className="max-w-xs" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Minimum Approach Length</label>
                    <Input type="number" defaultValue="100" className="max-w-xs" />
                  </div>
                  <Button variant="default">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
