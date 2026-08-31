import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title?: string;
  description?: string;
}

const defaultMeta = {
  title: "DSA Logic Builder",
  description: "Master DSA through forced reasoning, step-locked learning, and pattern recognition. Build interview confidence that lasts.",
};

/**
 * Hook to manage document title and meta tags for SEO
 */
export const useSEO = ({ title, description }: SEOHeadProps = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    const fullTitle = title 
      ? `${title} | DSA Logic Builder` 
      : defaultMeta.title;
    document.title = fullTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description || defaultMeta.description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);
    if (ogDescription) ogDescription.setAttribute("content", description || defaultMeta.description);
    if (ogUrl) ogUrl.setAttribute("content", window.location.href);

  }, [title, description, location.pathname]);
};

/**
 * Page-specific SEO configurations
 */
export const pageSEO = {
  home: {
    title: undefined, // Uses default
    description: "Master DSA through forced reasoning, step-locked learning, and pattern recognition. Build interview confidence that lasts.",
  },
  dashboard: {
    title: "Dashboard",
    description: "Track your DSA learning progress, streaks, and problem-solving statistics.",
  },
  problems: {
    title: "Problem Library",
    description: "Browse and solve DSA problems with our step-locked learning approach. Master patterns like Two Pointers, Sliding Window, and more.",
  },
  patterns: {
    title: "DSA Patterns",
    description: "Learn essential DSA patterns: Two Pointers, Sliding Window, Binary Search, Dynamic Programming, and more.",
  },
  interview: {
    title: "Interview Mode",
    description: "Practice DSA problems in a timed interview simulation environment.",
  },
  analytics: {
    title: "Analytics",
    description: "Analyze your DSA problem-solving performance, time metrics, and identify areas for improvement.",
  },
  auth: {
    title: "Sign In",
    description: "Sign in or create an account to track your DSA learning progress.",
  },
  settings: {
    title: "Profile Settings",
    description: "Manage your DSA Logic Builder profile and preferences.",
  },
};

export default useSEO;
