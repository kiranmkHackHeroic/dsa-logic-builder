import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  StickyNote,
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  Clock,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Star,
  Filter,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Note {
  id: string;
  problemId: string;
  problemTitle: string;
  title: string;
  content: string;
  tags: string[];
  category: "approach" | "mistake" | "insight" | "review";
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockNotes: Note[] = [
  {
    id: "1",
    problemId: "1",
    problemTitle: "Two Sum",
    title: "Hash Map is Key",
    content: "Always consider using a hash map when you need O(1) lookup. For Two Sum, store complement (target - num) and check if current num exists as we iterate.",
    tags: ["Hash Map", "O(n) solution"],
    category: "approach",
    isStarred: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
  },
  {
    id: "2",
    problemId: "2",
    problemTitle: "Container With Most Water",
    title: "Two Pointers Pattern",
    content: "Start from both ends and move the pointer with smaller height. This works because moving the larger one can never increase the area (limited by shorter line).",
    tags: ["Two Pointers", "Greedy"],
    category: "insight",
    isStarred: true,
    createdAt: "2024-01-07",
    updatedAt: "2024-01-07",
  },
  {
    id: "3",
    problemId: "3",
    problemTitle: "Longest Substring Without Repeating Characters",
    title: "Off-by-one Error",
    content: "Made a mistake with window size calculation. Remember: window size = right - left + 1, but after moving left pointer, don't add 1!",
    tags: ["Sliding Window", "Bug Fix"],
    category: "mistake",
    isStarred: false,
    createdAt: "2024-01-06",
    updatedAt: "2024-01-06",
  },
  {
    id: "4",
    problemId: "4",
    problemTitle: "Binary Search",
    title: "Review: Boundary Conditions",
    content: "Need to review: when to use left <= right vs left < right. Also practice variants: find first/last occurrence, search in rotated array.",
    tags: ["Binary Search", "Practice Needed"],
    category: "review",
    isStarred: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
];

const categoryIcons = {
  approach: BookOpen,
  mistake: AlertCircle,
  insight: Lightbulb,
  review: Clock,
};

const categoryColors = {
  approach: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  mistake: "bg-red-500/10 text-red-500 border-red-500/30",
  insight: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  review: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formProblem, setFormProblem] = useState("");
  const [formCategory, setFormCategory] = useState<Note["category"]>("approach");
  const [formTags, setFormTags] = useState("");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.problemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    const matchesStarred = !showStarredOnly || note.isStarred;
    return matchesSearch && matchesCategory && matchesStarred;
  });

  const handleSaveNote = () => {
    const newNote: Note = {
      id: editingNote?.id || Date.now().toString(),
      problemId: formProblem || "1",
      problemTitle: formProblem || "General Note",
      title: formTitle,
      content: formContent,
      tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
      category: formCategory,
      isStarred: editingNote?.isStarred || false,
      createdAt: editingNote?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    if (editingNote) {
      setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? newNote : n)));
    } else {
      setNotes((prev) => [newNote, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormProblem("");
    setFormCategory("approach");
    setFormTags("");
    setEditingNote(null);
    setIsCreateDialogOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormProblem(note.problemTitle);
    setFormCategory(note.category);
    setFormTags(note.tags.join(", "));
    setEditingNote(note);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const toggleStar = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isStarred: !n.isStarred } : n))
    );
  };

  const stats = {
    total: notes.length,
    approaches: notes.filter((n) => n.category === "approach").length,
    mistakes: notes.filter((n) => n.category === "mistake").length,
    insights: notes.filter((n) => n.category === "insight").length,
    reviews: notes.filter((n) => n.category === "review").length,
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
                  <span className="gradient-text">My Notes</span>
                </h1>
                <p className="text-muted-foreground">
                  Personal notes and learnings from problem solving
                </p>
              </div>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => resetForm()}>
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingNote ? "Edit Note" : "Create New Note"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Input
                      placeholder="Note title..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Problem name (optional)"
                      value={formProblem}
                      onChange={(e) => setFormProblem(e.target.value)}
                    />
                    <Select value={formCategory} onValueChange={(v) => setFormCategory(v as Note["category"])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approach">Approach</SelectItem>
                        <SelectItem value="mistake">Mistake</SelectItem>
                        <SelectItem value="insight">Insight</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Textarea
                      placeholder="Write your notes here..."
                      rows={6}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Tags (comma separated): e.g., Binary Search, Tips"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNote} className="flex-1">
                      {editingNote ? "Update Note" : "Save Note"}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="py-4 text-center">
                <StickyNote className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Notes</p>
              </CardContent>
            </Card>
            {(["approach", "mistake", "insight", "review"] as const).map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <Card key={cat}>
                  <CardContent className="py-4 text-center">
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${categoryColors[cat].split(" ")[1]}`} />
                    <p className="text-2xl font-bold">{stats[`${cat}s` as keyof typeof stats]}</p>
                    <p className="text-xs text-muted-foreground capitalize">{cat}s</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="approach">Approaches</SelectItem>
                <SelectItem value="mistake">Mistakes</SelectItem>
                <SelectItem value="insight">Insights</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showStarredOnly ? "default" : "outline"}
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className="gap-2"
            >
              <Star className={`h-4 w-4 ${showStarredOnly ? "fill-current" : ""}`} />
              Starred
            </Button>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => {
                const CategoryIcon = categoryIcons[note.category];
                return (
                  <Card key={note.id} className="group hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <Badge className={categoryColors[note.category]}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {note.category}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleStar(note.id)}
                          >
                            <Star
                              className={`h-4 w-4 ${note.isStarred ? "fill-yellow-500 text-yellow-500" : ""}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditNote(note)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{note.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {note.problemTitle}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {note.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Updated {note.updatedAt}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first note"}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
