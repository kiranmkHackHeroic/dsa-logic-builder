import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Search,
  Plus,
  TrendingUp,
  Filter,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    level: string;
  };
  problemId?: string;
  problemTitle?: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
  isPinned?: boolean;
}

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    title: "Best approach for Two Sum - Hash Map vs Two Pointers?",
    content: "I've been solving Two Sum and wondering which approach is better in interviews. Hash map gives O(n) but uses extra space...",
    author: { name: "Alex Chen", level: "Expert" },
    problemId: "1",
    problemTitle: "Two Sum",
    tags: ["Hash Map", "Two Pointers", "Interview Tips"],
    likes: 42,
    replies: 15,
    views: 234,
    createdAt: "2 hours ago",
    isPinned: true,
  },
  {
    id: "2",
    title: "How to identify when to use Dynamic Programming?",
    content: "I always struggle to identify DP problems. What are the key indicators that a problem requires DP?",
    author: { name: "Sarah Miller", level: "Intermediate" },
    tags: ["Dynamic Programming", "Problem Solving", "Tips"],
    likes: 89,
    replies: 28,
    views: 567,
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Sliding Window Template - Share your approach",
    content: "Here's my go-to template for sliding window problems. Would love to hear how others approach it...",
    author: { name: "Mike Johnson", level: "Advanced" },
    tags: ["Sliding Window", "Template", "Code Sharing"],
    likes: 156,
    replies: 42,
    views: 892,
    createdAt: "1 day ago",
  },
  {
    id: "4",
    title: "Failed Google Interview - Here's what I learned",
    content: "Just had my Google interview and didn't make it. Sharing my experience and lessons learned for others...",
    author: { name: "David Park", level: "Intermediate" },
    tags: ["Interview Experience", "Google", "Lessons Learned"],
    likes: 234,
    replies: 67,
    views: 1243,
    createdAt: "2 days ago",
  },
  {
    id: "5",
    title: "Binary Search edge cases - comprehensive guide",
    content: "After solving 50+ binary search problems, here are all the edge cases you need to handle...",
    author: { name: "Emma Wilson", level: "Expert" },
    tags: ["Binary Search", "Edge Cases", "Guide"],
    likes: 178,
    replies: 31,
    views: 756,
    createdAt: "3 days ago",
  },
];

const popularTags = [
  "Dynamic Programming",
  "Two Pointers",
  "Binary Search",
  "Graph",
  "Tree",
  "Interview Tips",
  "Google",
  "Amazon",
  "Meta",
];

const DiscussionForum = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredDiscussions = mockDiscussions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || d.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreatePost = () => {
    // In a real app, this would save to the database
    console.log({ title: newPostTitle, content: newPostContent, tags: newPostTags.split(",") });
    setIsDialogOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="gradient-text">Discussion Forum</span>
                </h1>
                <p className="text-muted-foreground">
                  Share knowledge, ask questions, and learn together
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Input
                      placeholder="Discussion title..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Share your thoughts, questions, or insights..."
                      rows={6}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Tags (comma separated): e.g., Binary Search, Tips"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreatePost} className="w-full">
                    Post Discussion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={selectedTag === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(null)}
            >
              All Topics
            </Badge>
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="latest" className="mb-6">
            <TabsList>
              <TabsTrigger value="latest">
                <Clock className="h-4 w-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="unanswered">
                <MessageSquare className="h-4 w-4 mr-2" />
                Unanswered
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="mt-6">
              <div className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="space-y-4">
                {[...filteredDiscussions]
                  .sort((a, b) => b.likes - a.likes)
                  .map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="unanswered" className="mt-6">
              <div className="space-y-4">
                {filteredDiscussions
                  .filter((d) => d.replies === 0)
                  .map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))}
                {filteredDiscussions.filter((d) => d.replies === 0).length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No unanswered discussions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const DiscussionCard = ({ discussion }: { discussion: Discussion }) => {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={discussion.author.avatar} />
            <AvatarFallback>
              {discussion.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {discussion.isPinned && (
                    <Badge variant="secondary" className="text-xs">
                      Pinned
                    </Badge>
                  )}
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                    {discussion.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {discussion.content}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {discussion.problemTitle && (
                <Badge variant="outline" className="text-xs">
                  Problem: {discussion.problemTitle}
                </Badge>
              )}
              {discussion.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {discussion.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                {discussion.author.name}
              </span>
              <Badge variant="outline" className="text-xs">
                {discussion.author.level}
              </Badge>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {discussion.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {discussion.replies}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {discussion.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {discussion.createdAt}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionForum;
