import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useUtils";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Bookmark and Notes system for problems
 */

export interface Bookmark {
  problemId: string;
  createdAt: string;
  notes: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard" | null;
  starred: boolean;
}

export type BookmarkTag =
  | "review-later"
  | "important"
  | "tricky"
  | "favorite"
  | "interview-prep"
  | "needs-practice";

export const BOOKMARK_TAGS: { value: BookmarkTag; label: string; color: string }[] = [
  { value: "review-later", label: "Review Later", color: "bg-blue-500" },
  { value: "important", label: "Important", color: "bg-red-500" },
  { value: "tricky", label: "Tricky", color: "bg-orange-500" },
  { value: "favorite", label: "Favorite", color: "bg-pink-500" },
  { value: "interview-prep", label: "Interview Prep", color: "bg-purple-500" },
  { value: "needs-practice", label: "Needs Practice", color: "bg-yellow-500" },
];

/**
 * Hook for managing bookmarks and notes
 */
export function useBookmarks() {
  const { user } = useAuth();
  const bookmarkStorageKey = `problem-bookmarks:${user?.id ?? "guest"}`;

  const [bookmarks, setBookmarks] = useLocalStorage<Record<string, Bookmark>>(
    bookmarkStorageKey,
    {}
  );

  // Check if a problem is bookmarked
  const isBookmarked = useCallback(
    (problemId: string) => !!bookmarks[problemId],
    [bookmarks]
  );

  // Get bookmark for a problem
  const getBookmark = useCallback(
    (problemId: string): Bookmark | null => bookmarks[problemId] || null,
    [bookmarks]
  );

  // Add or update bookmark
  const addBookmark = useCallback(
    (problemId: string, data?: Partial<Bookmark>) => {
      setBookmarks((prev) => ({
        ...prev,
        [problemId]: {
          problemId,
          createdAt: prev[problemId]?.createdAt || new Date().toISOString(),
          notes: data?.notes ?? prev[problemId]?.notes ?? "",
          tags: data?.tags ?? prev[problemId]?.tags ?? [],
          difficulty: data?.difficulty ?? prev[problemId]?.difficulty ?? null,
          starred: data?.starred ?? prev[problemId]?.starred ?? false,
        },
      }));
    },
    [setBookmarks]
  );

  // Remove bookmark
  const removeBookmark = useCallback(
    (problemId: string) => {
      setBookmarks((prev) => {
        const { [problemId]: _, ...rest } = prev;
        return rest;
      });
    },
    [setBookmarks]
  );

  // Toggle bookmark
  const toggleBookmark = useCallback(
    (problemId: string) => {
      if (isBookmarked(problemId)) {
        removeBookmark(problemId);
      } else {
        addBookmark(problemId);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  // Update notes
  const updateNotes = useCallback(
    (problemId: string, notes: string) => {
      if (bookmarks[problemId]) {
        addBookmark(problemId, { notes });
      }
    },
    [bookmarks, addBookmark]
  );

  // Add tag
  const addTag = useCallback(
    (problemId: string, tag: string) => {
      const bookmark = bookmarks[problemId];
      if (bookmark && !bookmark.tags.includes(tag)) {
        addBookmark(problemId, { tags: [...bookmark.tags, tag] });
      }
    },
    [bookmarks, addBookmark]
  );

  // Remove tag
  const removeTag = useCallback(
    (problemId: string, tag: string) => {
      const bookmark = bookmarks[problemId];
      if (bookmark) {
        addBookmark(problemId, { tags: bookmark.tags.filter((t) => t !== tag) });
      }
    },
    [bookmarks, addBookmark]
  );

  // Toggle star
  const toggleStar = useCallback(
    (problemId: string) => {
      const bookmark = bookmarks[problemId];
      if (bookmark) {
        addBookmark(problemId, { starred: !bookmark.starred });
      } else {
        addBookmark(problemId, { starred: true });
      }
    },
    [bookmarks, addBookmark]
  );

  // Get all bookmarks as array
  const allBookmarks = useMemo(() => Object.values(bookmarks), [bookmarks]);

  // Get starred bookmarks
  const starredBookmarks = useMemo(
    () => allBookmarks.filter((b) => b.starred),
    [allBookmarks]
  );

  // Get bookmarks by tag
  const getBookmarksByTag = useCallback(
    (tag: string) => allBookmarks.filter((b) => b.tags.includes(tag)),
    [allBookmarks]
  );

  // Get statistics
  const stats = useMemo(
    () => ({
      total: allBookmarks.length,
      starred: starredBookmarks.length,
      withNotes: allBookmarks.filter((b) => b.notes.length > 0).length,
      byTag: BOOKMARK_TAGS.reduce((acc, tag) => {
        acc[tag.value] = allBookmarks.filter((b) =>
          b.tags.includes(tag.value)
        ).length;
        return acc;
      }, {} as Record<string, number>),
    }),
    [allBookmarks, starredBookmarks]
  );

  return {
    bookmarks,
    isBookmarked,
    getBookmark,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    updateNotes,
    addTag,
    removeTag,
    toggleStar,
    allBookmarks,
    starredBookmarks,
    getBookmarksByTag,
    stats,
    BOOKMARK_TAGS,
  };
}

export default useBookmarks;
