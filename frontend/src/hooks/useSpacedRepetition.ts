import { useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useUtils";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Spaced Repetition System using SM-2 algorithm
 * Helps users review problems at optimal intervals
 */

export interface ReviewCard {
  problemId: string;
  easeFactor: number; // 1.3 to 2.5, starts at 2.5
  interval: number; // days until next review
  repetitions: number; // successful reviews in a row
  nextReviewDate: string; // ISO date string
  lastReviewDate: string | null;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 - Complete blackout, couldn't recall
// 1 - Incorrect, but recognized answer
// 2 - Incorrect, but answer was easy to recall
// 3 - Correct with serious difficulty
// 4 - Correct with some hesitation
// 5 - Perfect recall

const QUALITY_LABELS: Record<ReviewQuality, string> = {
  0: "Blackout",
  1: "Wrong",
  2: "Hard",
  3: "Good",
  4: "Easy",
  5: "Perfect",
};

const QUALITY_COLORS: Record<ReviewQuality, string> = {
  0: "bg-destructive",
  1: "bg-destructive/80",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success/80",
  5: "bg-success",
};

/**
 * Calculate next review date using SM-2 algorithm
 */
function calculateNextReview(
  card: ReviewCard,
  quality: ReviewQuality
): ReviewCard {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Failed review - reset repetitions
    repetitions = 0;
    interval = 1;
  } else {
    // Successful review
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewDate: new Date().toISOString(),
  };
}

/**
 * Hook for managing spaced repetition reviews
 */
export function useSpacedRepetition() {
  const { user } = useAuth();
  const spacedRepetitionStorageKey = `srs-cards:${user?.id ?? "guest"}`;

  const [cards, setCards] = useLocalStorage<Record<string, ReviewCard>>(
    spacedRepetitionStorageKey,
    {}
  );

  // Get or create a card for a problem
  const getCard = useCallback(
    (problemId: string): ReviewCard => {
      if (cards[problemId]) {
        return cards[problemId];
      }
      return {
        problemId,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date().toISOString(),
        lastReviewDate: null,
      };
    },
    [cards]
  );

  // Add a problem to the review queue
  const addToReview = useCallback(
    (problemId: string) => {
      if (!cards[problemId]) {
        setCards((prev) => ({
          ...prev,
          [problemId]: {
            problemId,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReviewDate: new Date().toISOString(),
            lastReviewDate: null,
          },
        }));
      }
    },
    [cards, setCards]
  );

  // Review a problem with a quality rating
  const reviewProblem = useCallback(
    (problemId: string, quality: ReviewQuality) => {
      const card = getCard(problemId);
      const updatedCard = calculateNextReview(card, quality);
      setCards((prev) => ({
        ...prev,
        [problemId]: updatedCard,
      }));
      return updatedCard;
    },
    [getCard, setCards]
  );

  // Get problems due for review today
  const dueForReview = useMemo(() => {
    const now = new Date();
    return Object.values(cards).filter((card) => {
      const reviewDate = new Date(card.nextReviewDate);
      return reviewDate <= now;
    });
  }, [cards]);

  // Get upcoming reviews (next 7 days)
  const upcomingReviews = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return Object.values(cards)
      .filter((card) => {
        const reviewDate = new Date(card.nextReviewDate);
        return reviewDate > now && reviewDate <= weekFromNow;
      })
      .sort(
        (a, b) =>
          new Date(a.nextReviewDate).getTime() -
          new Date(b.nextReviewDate).getTime()
      );
  }, [cards]);

  // Get review statistics
  const stats = useMemo(() => {
    const allCards = Object.values(cards);
    const totalCards = allCards.length;
    const masteredCards = allCards.filter((c) => c.interval >= 21).length;
    const learningCards = allCards.filter(
      (c) => c.interval > 0 && c.interval < 21
    ).length;
    const newCards = allCards.filter((c) => c.interval === 0).length;
    const avgEaseFactor =
      totalCards > 0
        ? allCards.reduce((sum, c) => sum + c.easeFactor, 0) / totalCards
        : 0;

    return {
      totalCards,
      masteredCards,
      learningCards,
      newCards,
      dueToday: dueForReview.length,
      avgEaseFactor: avgEaseFactor.toFixed(2),
    };
  }, [cards, dueForReview]);

  return {
    cards,
    getCard,
    addToReview,
    reviewProblem,
    dueForReview,
    upcomingReviews,
    stats,
    QUALITY_LABELS,
    QUALITY_COLORS,
  };
}

export default useSpacedRepetition;
