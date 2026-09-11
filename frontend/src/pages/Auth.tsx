import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Mail, Lock, User, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { checkRateLimit, RATE_LIMITS, formatRemainingTime } from "@/lib/rateLimit";

// Login schema - simpler validation (server handles auth)
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Signup schema - strict password requirements for new users
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  displayName: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    try {
      if (isLogin) {
        // Use simpler validation for login
        loginSchema.parse({ email, password });
      } else {
        // Use strict validation for signup
        signupSchema.parse({ email, password, displayName: displayName || undefined });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check rate limit
    const rateLimitKey = isLogin ? 'login' : 'signup';
    const rateLimit = isLogin ? RATE_LIMITS.LOGIN : RATE_LIMITS.SIGNUP;
    const { isLimited, remainingMs } = checkRateLimit(rateLimitKey, rateLimit);
    
    if (isLimited) {
      toast({
        title: "Too many attempts",
        description: `Please wait ${formatRemainingTime(remainingMs)} before trying again.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (
            error.message.includes("Database service unavailable") ||
            error.message.includes("503") ||
            error.message.includes("Internal server error")
          ) {
            toast({
              title: "Cloud Database Unavailable",
              description: "The backend cannot reach the MySQL database. You can click 'Continue as Guest' below to start using the app immediately!",
              variant: "destructive",
            });
          } else if (error.message.includes("Invalid login credentials") || error.message.includes("Invalid email or password")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (
            error.message.includes("Database service unavailable") ||
            error.message.includes("503") ||
            error.message.includes("Internal server error")
          ) {
            toast({
              title: "Cloud Database Unavailable",
              description: "The backend cannot reach the MySQL database. You can click 'Continue as Guest' below to start using the app immediately!",
              variant: "destructive",
            });
          } else if (error.message.includes("User already registered") || error.message.includes("Email already registered")) {
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Please log in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to DSA Logic Builder!",
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again or use Guest mode.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Brain className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold gradient-text">DSA Logic Builder</span>
        </Link>

        <Card variant="elevated">
          <CardHeader className="text-center">
            <Badge variant="primary" className="w-fit mx-auto mb-2">
              {isLogin ? "Welcome Back" : "Get Started"}
            </Badge>
            <CardTitle className="text-2xl">
              {isLogin ? "Log in to your account" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Continue your learning journey" 
                : "Start mastering DSA with logic-first learning"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Quick Demo Mode Banner */}
            <div className="mb-6 p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Instant Demo Mode</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary font-medium">Free Access</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Skip registration to instantly explore all interactive DSA problems, algorithms, and logic tools.
              </p>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="w-full gap-2 mt-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                onClick={() => {
                  continueAsGuest();
                  toast({
                    title: "Welcome, Guest Explorer!",
                    description: "You are exploring in Demo Mode with full access!",
                  });
                  navigate("/dashboard");
                }}
              >
                <Sparkles className="h-4 w-4" />
                Explore as Guest (Instant Access)
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or Sign In with Email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.displayName && (
                    <p className="text-xs text-destructive">{errors.displayName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
                {isLogin && (
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Log In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-all text-foreground"
                onClick={() => {
                  continueAsGuest();
                  toast({
                    title: "Welcome, Guest Explorer!",
                    description: "Exploring in Demo Mode with full access to DSA logic building.",
                  });
                  navigate("/dashboard");
                }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Continue as Guest (Demo Mode)
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
