import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bookmark,
  BookmarkCheck,
  Star,
  StarOff,
  Tag,
  MessageSquare,
  Check,
} from "lucide-react";
import { useBookmarks, BookmarkTag, BOOKMARK_TAGS } from "@/hooks/useBookmarks";

interface BookmarkButtonProps {
  problemId: string;
  variant?: "icon" | "full";
  className?: string;
}

export const BookmarkButton = ({
  problemId,
  variant = "icon",
  className = "",
}: BookmarkButtonProps) => {
  const { isBookmarked, addBookmark, removeBookmark, getBookmark, toggleStar } =
    useBookmarks();
  const bookmarked = isBookmarked(problemId);
  const bookmark = getBookmark(problemId);
  const [notes, setNotes] = useState(bookmark?.notes || "");
  const [selectedTags, setSelectedTags] = useState<BookmarkTag[]>(
    (bookmark?.tags || []) as BookmarkTag[]
  );

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(problemId);
    } else {
      addBookmark(problemId, { tags: selectedTags, notes });
    }
  };

  const handleStarToggle = () => {
    toggleStar(problemId);
  };

  const handleTagToggle = (tag: BookmarkTag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    if (bookmark) {
      addBookmark(problemId, { tags: newTags });
    }
  };

  const handleSaveNotes = () => {
    addBookmark(problemId, { notes, tags: selectedTags });
  };

  if (variant === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkToggle}
              className={className}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {bookmarked ? "Remove bookmark" : "Bookmark problem"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={bookmarked ? "default" : "outline"}
          size="sm"
          className={className}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 mr-2" />
          ) : (
            <Bookmark className="h-4 w-4 mr-2" />
          )}
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Bookmark</h4>
            {bookmark && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStarToggle}
              >
                {bookmark.starred ? (
                  <Star className="h-4 w-4 text-warning fill-warning" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
              <Tag className="h-3 w-3" /> Tags
            </label>
            <div className="flex flex-wrap gap-1">
              {BOOKMARK_TAGS.map((tagObj) => (
                <Badge
                  key={tagObj.value}
                  variant={selectedTags.includes(tagObj.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tagObj.value)}
                >
                  {selectedTags.includes(tagObj.value) && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {tagObj.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
              <MessageSquare className="h-3 w-3" /> Notes
            </label>
            <Textarea
              placeholder="Add notes about this problem..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!bookmarked ? (
              <Button className="flex-1" onClick={() => addBookmark(problemId, { tags: selectedTags, notes })}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save Bookmark
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1" onClick={handleSaveNotes}>
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeBookmark(problemId)}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Compact version for problem cards
export const BookmarkBadge = ({ problemId }: { problemId: string }) => {
  const { isBookmarked, getBookmark } = useBookmarks();
  const bookmark = getBookmark(problemId);

  if (!isBookmarked(problemId)) return null;

  return (
    <div className="flex items-center gap-1">
      <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
      {bookmark?.starred && (
        <Star className="h-3 w-3 text-warning fill-warning" />
      )}
      {bookmark?.tags && bookmark.tags.length > 0 && (
        <span className="text-xs text-muted-foreground">
          {bookmark.tags.length} tags
        </span>
      )}
    </div>
  );
};
