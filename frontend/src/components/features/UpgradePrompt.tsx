import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface UpgradePromptProps {
  feature: string;
  requiredPlan?: "pro" | "premium";
  compact?: boolean;
}

export const UpgradePrompt = ({
  feature,
  requiredPlan = "pro",
  compact = false,
}: UpgradePromptProps) => {
  const { plan } = useSubscription();

  if (plan === "premium" || (plan === "pro" && requiredPlan === "pro")) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-sm">
          {feature} requires{" "}
          <Link to="/pricing" className="text-primary font-medium hover:underline">
            {requiredPlan === "premium" ? "Premium" : "Pro"} plan
          </Link>
        </span>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {requiredPlan === "premium" ? (
            <Sparkles className="h-8 w-8 text-primary" />
          ) : (
            <Crown className="h-8 w-8 text-primary" />
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">Unlock {feature}</h3>
        <p className="text-muted-foreground mb-6">
          Upgrade to {requiredPlan === "premium" ? "Premium" : "Pro"} to access this
          feature and accelerate your DSA journey.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/pricing">
            <Button className="w-full" size="lg">
              <Crown className="h-4 w-4 mr-2" />
              View Plans
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// HOC to wrap components that require a subscription
export const withSubscription = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: string,
  requiredPlan: "pro" | "premium" = "pro"
) => {
  return (props: P) => {
    const { canAccess } = useSubscription();

    const featureKey =
      feature === "Code Templates"
        ? "codeTemplates"
        : feature === "Company Problems"
        ? "companyProblems"
        : feature === "Interview Mode"
        ? "interviewMode"
        : feature === "AI Hints"
        ? "aiHints"
        : "codeTemplates";

    if (!canAccess(featureKey as keyof ReturnType<typeof useSubscription>["subscription"]["limits"])) {
      return <UpgradePrompt feature={feature} requiredPlan={requiredPlan} />;
    }

    return <WrappedComponent {...props} />;
  };
};

// Remaining problems indicator
export const RemainingProblemsIndicator = () => {
  const { getRemainingProblems, plan } = useSubscription();
  const remaining = getRemainingProblems();

  if (remaining === -1) return null; // unlimited

  const isLow = remaining <= 2;

  return (
    <Badge variant={isLow ? "destructive" : "secondary"} className="gap-1">
      {remaining} problems left today
      {isLow && plan === "free" && (
        <Link to="/pricing" className="ml-1 underline">
          Upgrade
        </Link>
      )}
    </Badge>
  );
};
