import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  X,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSubscription, PLANS, PlanType } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { plan: currentPlan, upgradeToPlan } = useSubscription();
  const { user } = useAuth();

  const getYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 10).toFixed(2); // 2 months free
  };

  const handleSelectPlan = async (planId: PlanType) => {
    if (!user) {
      // Redirect to auth
      window.location.href = "/auth?redirect=/pricing";
      return;
    }

    if (planId === "free") {
      await upgradeToPlan("free");
      return;
    }

    // In production, redirect to Stripe Checkout
    // For demo, just upgrade
    await upgradeToPlan(planId);
    alert(`Upgraded to ${planId} plan! In production, this would redirect to Stripe.`);
  };

  const planIcons = {
    free: Zap,
    pro: Crown,
    premium: Sparkles,
  };

  const planColors = {
    free: "from-gray-500 to-gray-600",
    pro: "from-primary to-accent",
    premium: "from-amber-500 to-orange-600",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose the plan that's right for you
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Start free and upgrade as you grow. All plans include a 7-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={!isYearly ? "font-semibold" : "text-muted-foreground"}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={isYearly ? "font-semibold" : "text-muted-foreground"}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="success" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {PLANS.map((planData) => {
            const Icon = planIcons[planData.id];
            const isCurrentPlan = currentPlan === planData.id;
            const isPopular = planData.id === "pro";

            return (
              <Card
                key={planData.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  isPopular ? "border-primary shadow-lg scale-105" : ""
                } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent py-1 text-center text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                {isCurrentPlan && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    Current Plan
                  </Badge>
                )}

                <CardHeader className={`pt-${isPopular ? "10" : "6"}`}>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      planColors[planData.id]
                    } flex items-center justify-center mb-4`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{planData.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${isYearly ? getYearlyPrice(planData.price) : planData.price}
                    </span>
                    {planData.price > 0 && (
                      <span className="text-muted-foreground">
                        /{isYearly ? "year" : "month"}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {planData.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSelectPlan(planData.id)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : planData.price === 0
                      ? "Get Started Free"
                      : "Start Free Trial"}
                    {!isCurrentPlan && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Feature</th>
                    <th className="text-center p-4">Free</th>
                    <th className="text-center p-4 bg-primary/5">Pro</th>
                    <th className="text-center p-4">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Problems per day", free: "5", pro: "Unlimited", premium: "Unlimited" },
                    { feature: "DSA Patterns", free: "3", pro: "15+", premium: "15+" },
                    { feature: "Code Templates", free: false, pro: true, premium: true },
                    { feature: "Company Problems", free: false, pro: true, premium: true },
                    { feature: "Interview Mode", free: false, pro: true, premium: true },
                    { feature: "AI Hints", free: false, pro: false, premium: true },
                    { feature: "Progress Export", free: false, pro: true, premium: true },
                    { feature: "Priority Support", free: false, pro: false, premium: true },
                    { feature: "Mock Interviews", free: false, pro: false, premium: true },
                    { feature: "Certificate", free: false, pro: false, premium: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="text-center p-4">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="text-center p-4 bg-primary/5">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          row.pro
                        )}
                      </td>
                      <td className="text-center p-4">
                        {typeof row.premium === "boolean" ? (
                          row.premium ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          row.premium
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Stripe with 256-bit encryption
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">7-Day Free Trial</h3>
              <p className="text-sm text-muted-foreground">
                Try any plan free, cancel anytime
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">10,000+ Users</h3>
              <p className="text-sm text-muted-foreground">
                Trusted by engineers worldwide
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "Is there a student discount?",
                a: "Yes! Students get 50% off any paid plan. Just verify your student email to get the discount.",
              },
              {
                q: "Can I switch between plans?",
                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a full refund within the first 14 days if you're not satisfied with your purchase.",
              },
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
