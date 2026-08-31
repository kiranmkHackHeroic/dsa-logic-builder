import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bookmark,
  Star,
  Search,
  Tag,
  MessageSquare,
  ExternalLink,
  Trash2,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmarks, BOOKMARK_TAGS, BookmarkTag } from "@/hooks/useBookmarks";
import FeatureLayout from "@/components/layout/FeatureLayout";

const BookmarksPage = () => {
  const { allBookmarks, removeBookmark, getBookmarksByTag, stats } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "starred">("date");

  // Filter and sort bookmarks
  let filteredBookmarks =
    selectedTag === "all"
      ? allBookmarks
      : getBookmarksByTag(selectedTag as BookmarkTag);

  if (searchQuery) {
    filteredBookmarks = filteredBookmarks.filter(
      (b) =>
        b.problemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === "starred") {
    filteredBookmarks = [...filteredBookmarks].sort((a, b) =>
      a.starred === b.starred ? 0 : a.starred ? -1 : 1
    );
  } else {
    filteredBookmarks = [...filteredBookmarks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-primary" />
          Bookmarks
        </h1>
        <p className="text-muted-foreground">
          Your saved problems and personal notes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Bookmarks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.starred}</p>
                <p className="text-xs text-muted-foreground">Starred</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withNotes}</p>
                <p className="text-xs text-muted-foreground">With Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-40">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {BOOKMARK_TAGS.map((tagObj) => (
                  <SelectItem key={tagObj.value} value={tagObj.value}>
                    {tagObj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "date" | "starred")}
            >
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="starred">Starred First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No bookmarks found</h3>
            <p className="text-sm text-muted-foreground">
              {allBookmarks.length === 0
                ? "Start bookmarking problems to see them here"
                : "Try adjusting your filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.problemId} className="group hover:border-primary/30 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bookmark className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Problem {bookmark.problemId}</h3>
                      {bookmark.starred && (
                        <Star className="h-4 w-4 text-warning fill-warning" />
                      )}
                    </div>
                    {bookmark.notes && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {bookmark.notes}
                      </p>
                    )}
                    {bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {bookmark.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/problems/${bookmark.problemId}`}>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bookmark.problemId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const BookmarksPageWithLayout = () => (
  <FeatureLayout>
    <BookmarksPage />
  </FeatureLayout>
);

export default BookmarksPageWithLayout;
