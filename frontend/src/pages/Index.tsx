import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Brain, 
  Target, 
  Lightbulb, 
  Code2, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  Lock,
  Sparkles,
  BookOpen,
  Timer,
  BarChart3
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const startLearningPath = user ? "/problems/1" : "/auth?redirect=/problems/1";

  const features = [
    {
      icon: Brain,
      title: "Think Before Code",
      description: "Forced reasoning steps before you can touch the editor. Build real problem-solving skills.",
    },
    {
      icon: Lock,
      title: "Step-Locked Learning",
      description: "Each step unlocks only after completing the previous. No shortcuts, no cheating yourself.",
    },
    {
      icon: Sparkles,
      title: "Pattern Recognition",
      description: "Learn to identify problem patterns, not memorize solutions. True interview preparation.",
    },
    {
      icon: Target,
      title: "Constraint Awareness",
      description: "Understand why brute force fails. Learn to analyze constraints and optimize accordingly.",
    },
    {
      icon: BarChart3,
      title: "Visual Simulations",
      description: "Watch your algorithms come alive with step-by-step animations and visualizations.",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track thinking time vs coding time, pattern mastery, and identify weak areas.",
    },
  ];

  const problemFlow = [
    { step: 1, title: "Understand", desc: "Explain the problem in your own words" },
    { step: 2, title: "Think Manually", desc: "Solve with small examples on paper" },
    { step: 3, title: "Brute Force", desc: "Identify the naive approach first" },
    { step: 4, title: "Optimize", desc: "Find patterns and better data structures" },
    { step: 5, title: "Explain", desc: "Write your optimal approach in words" },
    { step: 6, title: "Code", desc: "Finally, implement your solution" },
  ];

  const patterns = [
    { name: "Two Pointers", problems: 24, color: "primary" },
    { name: "Sliding Window", problems: 18, color: "accent" },
    { name: "Binary Search", problems: 21, color: "success" },
    { name: "Dynamic Programming", problems: 45, color: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <Badge variant="primary" className="mb-6 animate-fade-in">
            Logic-First DSA Learning
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Learn How to <span className="gradient-text">Think</span>,
            <br />
            Not Just Code
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Master DSA through forced reasoning, step-locked learning, and pattern recognition. 
            Build interview confidence that lasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to={startLearningPath}>
              <Button variant="hero" size="xl">
                Start Learning
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/patterns">
              <Button variant="hero-outline" size="xl">
                <BookOpen className="h-5 w-5" />
                Explore Patterns
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "150+", label: "Problems" },
              { value: "12", label: "Patterns" },
              { value: "7", label: "Step Flow" },
              { value: "∞", label: "Confidence" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Flow Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">The DSA Logic Builder Flow</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Forced Thinking. No Shortcuts.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every problem follows our step-locked flow. You cannot code until you think.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {problemFlow.map((item, idx) => (
              <div key={item.step} className="relative group">
                <Card variant="feature" className="h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
                {idx < problemFlow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Why DSA Logic Builder?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Real Learning
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not another LeetCode clone. We focus on teaching you how to think, not memorize.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} variant="interactive" className="group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pattern Library Preview */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" className="mb-4">Pattern Library</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Master the Patterns
              </h2>
              <p className="text-muted-foreground mb-6">
                Learn when to use each pattern, when NOT to use it, and common mistakes. 
                Each pattern comes with detailed explanations and practice problems.
              </p>
              <Link to="/patterns">
                <Button variant="hero">
                  <Sparkles className="h-4 w-4" />
                  Explore All Patterns
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {patterns.map((pattern) => (
                <Card key={pattern.name} variant="interactive" className="group">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{pattern.name}</h3>
                      <Badge variant={pattern.color as "primary" | "accent" | "success" | "warning"}>{pattern.problems} problems</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all group-hover:w-full" 
                        style={{ width: `${(pattern.problems / 45) * 100}%` }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interview Mode CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="warning" className="mb-4">Interview Mode</Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    Simulate Real Interviews
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Practice with a timer, locked code editor, and forced verbal explanation. 
                    Get evaluated on logic clarity, correctness, and optimization quality.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="h-4 w-4 text-warning" />
                      <span>45-min Timer</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-warning" />
                      <span>Locked Code Initially</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-warning" />
                      <span>Logic Evaluation</span>
                    </div>
                  </div>
                  <Link to="/interview" className="inline-block mt-6">
                    <Button variant="hero" size="lg">
                      Try Interview Mode
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-20" />
                    <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-destructive/50" />
                        <div className="w-3 h-3 rounded-full bg-warning/50" />
                        <div className="w-3 h-3 rounded-full bg-success/50" />
                      </div>
                      <div className="space-y-3 font-mono text-sm">
                        <div className="text-muted-foreground">// Interview: Two Sum</div>
                        <div className="text-primary">Timer: 44:32</div>
                        <div className="text-warning">Step: Explain Approach</div>
                        <div className="text-success">Logic Score: 85%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Think Differently?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Stop memorizing solutions. Start building real problem-solving skills 
            that will last beyond any interview.
          </p>
          <Link to={startLearningPath}>
            <Button variant="hero" size="xl">
              Start Your First Problem
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
