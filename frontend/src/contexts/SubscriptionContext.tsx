import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type PlanType = "free" | "pro" | "premium";

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    problemsPerDay: number;
    patterns: number;
    codeTemplates: boolean;
    companyProblems: boolean;
    interviewMode: boolean;
    aiHints: boolean;
    progressExport: boolean;
    prioritySupport: boolean;
  };
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "5 problems per day",
      "3 basic patterns",
      "Community support",
      "Basic progress tracking",
      "Daily challenges",
    ],
    limits: {
      problemsPerDay: 5,
      patterns: 3,
      codeTemplates: false,
      companyProblems: false,
      interviewMode: false,
      aiHints: false,
      progressExport: false,
      prioritySupport: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    interval: "month",
    features: [
      "Unlimited problems",
      "All 15+ patterns",
      "Code templates library",
      "Company-specific problems",
      "Interview simulation mode",
      "Spaced repetition system",
      "Detailed analytics",
      "Email support",
    ],
    limits: {
      problemsPerDay: -1, // unlimited
      patterns: -1, // unlimited
      codeTemplates: true,
      companyProblems: true,
      interviewMode: true,
      aiHints: false,
      progressExport: true,
      prioritySupport: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    interval: "month",
    features: [
      "Everything in Pro",
      "AI-powered hints & explanations",
      "1-on-1 mock interviews",
      "Resume review",
      "Priority support",
      "Early access to new features",
      "Exclusive Discord community",
      "Certificate of completion",
    ],
    limits: {
      problemsPerDay: -1,
      patterns: -1,
      codeTemplates: true,
      companyProblems: true,
      interviewMode: true,
      aiHints: true,
      progressExport: true,
      prioritySupport: true,
    },
  },
];

interface SubscriptionContextType {
  plan: PlanType;
  subscription: Plan;
  isLoading: boolean;
  canAccess: (feature: keyof Plan["limits"]) => boolean;
  getRemainingProblems: () => number;
  upgradeToPlan: (planId: PlanType) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [problemsSolvedToday, setProblemsSolvedToday] = useState(0);

  const subscriptionStorageKey = `user-subscription:${user?.id ?? "guest"}`;
  const today = new Date().toISOString().split("T")[0];
  const problemsSolvedStorageKey = `problems-solved:${user?.id ?? "guest"}:${today}`;

  const subscription = PLANS.find((p) => p.id === plan) || PLANS[0];

  // Load subscription from localStorage or database
  useEffect(() => {
    const loadSubscription = async () => {
      setIsLoading(true);
      
      // Check localStorage first (for demo purposes)
      const savedPlan = localStorage.getItem(subscriptionStorageKey);
      if (savedPlan) {
        setPlan(savedPlan as PlanType);
      } else {
        setPlan("free");
      }

      // Load problems solved today
      const savedProblems = localStorage.getItem(problemsSolvedStorageKey);
      if (savedProblems) {
        setProblemsSolvedToday(parseInt(savedProblems, 10));
      } else {
        setProblemsSolvedToday(0);
      }

      setIsLoading(false);
    };

    loadSubscription();
  }, [subscriptionStorageKey, problemsSolvedStorageKey, user]);

  // Check if user can access a feature
  const canAccess = (feature: keyof Plan["limits"]): boolean => {
    const limit = subscription.limits[feature];
    if (typeof limit === "boolean") return limit;
    if (typeof limit === "number") return limit === -1 || limit > 0;
    return false;
  };

  // Get remaining problems for today
  const getRemainingProblems = (): number => {
    const limit = subscription.limits.problemsPerDay;
    if (limit === -1) return -1; // unlimited
    return Math.max(0, limit - problemsSolvedToday);
  };

  // Upgrade to a plan (integrate with Stripe/payment provider)
  const upgradeToPlan = async (planId: PlanType): Promise<void> => {
    // In production, this would redirect to Stripe Checkout
    // For demo, we'll just set the plan
    setPlan(planId);
    localStorage.setItem(subscriptionStorageKey, planId);
  };

  // Cancel subscription
  const cancelSubscription = async (): Promise<void> => {
    setPlan("free");
    localStorage.setItem(subscriptionStorageKey, "free");
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        subscription,
        isLoading,
        canAccess,
        getRemainingProblems,
        upgradeToPlan,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
