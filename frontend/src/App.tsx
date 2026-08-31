import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load pages for better initial load performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProblemSolving = lazy(() => import("./pages/ProblemSolving"));
const Problems = lazy(() => import("./pages/Problems"));
const Patterns = lazy(() => import("./pages/Patterns"));
const PatternDetail = lazy(() => import("./pages/PatternDetail"));
const InterviewMode = lazy(() => import("./pages/InterviewMode"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

// New feature pages
const StudyPlansPage = lazy(() => import("./components/features/StudyPlansPage"));
const AchievementsPage = lazy(() => import("./components/features/AchievementsPage"));
const CodeTemplatesPage = lazy(() => import("./components/features/CodeTemplatesPage"));
const BookmarksPage = lazy(() => import("./components/features/BookmarksPage"));
const CompanyProblemsPage = lazy(() => import("./components/features/CompanyProblemsPage"));
const Pricing = lazy(() => import("./pages/Pricing"));

// Additional feature pages
const DiscussionForum = lazy(() => import("./components/features/DiscussionForum"));
const CodeComparisonTool = lazy(() => import("./components/features/CodeComparisonTool"));
const ContestMode = lazy(() => import("./components/features/ContestMode"));
const NotesPage = lazy(() => import("./components/features/NotesPage"));
const ProgressHeatmap = lazy(() => import("./components/features/ProgressHeatmap"));

// Configure React Query with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/auth"
                    element={
                      <PublicRoute>
                        <Auth />
                      </PublicRoute>
                    }
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <ProfileSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/problems" element={<Problems />} />
                  <Route path="/problems/:id" element={<ProblemSolving />} />
                  <Route path="/patterns" element={<Patterns />} />
                  <Route path="/patterns/:patternId" element={<PatternDetail />} />
                  <Route
                    path="/interview"
                    element={
                      <ProtectedRoute>
                        <InterviewMode />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Pricing */}
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* New Feature Routes */}
                  <Route path="/study-plans" element={<StudyPlansPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/templates" element={<CodeTemplatesPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/company-problems" element={<CompanyProblemsPage />} />
                  
                  {/* Additional Feature Routes */}
                  <Route path="/discussions" element={<DiscussionForum />} />
                  <Route path="/compare" element={<CodeComparisonTool />} />
                  <Route path="/contest" element={<ContestMode />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/heatmap" element={<ProgressHeatmap />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
