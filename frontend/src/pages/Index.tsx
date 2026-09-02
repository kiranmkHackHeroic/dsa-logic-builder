import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Timer, 
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Award,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  FileCheck
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const startLearningPath = user ? "/problems/1" : "/auth?redirect=/problems/1";
  const [isBookmarked, setIsBookmarked] = useState(false);

  // W3Schools Sidebar Navigation Topics
  const sidebarSections = [
    {
      title: "DSA TUTORIAL",
      items: [
        { label: "DSA Home", href: "/", active: true },
        { label: "DSA 7-Step Method", href: "#method" },
        { label: "AI Dry Run Engine", href: "#ai-engine" },
        { label: "DSA Problem Ladder", href: "/problems" },
      ],
    },
    {
      title: "CORE PATTERNS",
      items: [
        { label: "Two Pointers", href: "/patterns/two-pointers" },
        { label: "Sliding Window", href: "/patterns/sliding-window" },
        { label: "Binary Search", href: "/patterns/binary-search" },
        { label: "Fast & Slow Pointers", href: "/patterns/fast-slow-pointers" },
        { label: "Monotonic Stack", href: "/patterns/monotonic-stack" },
        { label: "Tree BFS / DFS", href: "/patterns/tree-bfs" },
        { label: "0/1 Knapsack DP", href: "/patterns/01-knapsack" },
        { label: "Top K Elements", href: "/patterns/top-k-elements" },
      ],
    },
    {
      title: "TECH INTERVIEW TRACKS",
      items: [
        { label: "Google Top Problems", href: "/company-problems" },
        { label: "Meta Top Problems", href: "/company-problems" },
        { label: "Amazon Top Problems", href: "/company-problems" },
        { label: "Interview Simulator", href: "/interview" },
        { label: "Study Roadmaps", href: "/study-plans" },
      ],
    },
    {
      title: "PRACTICE & TOOLS",
      items: [
        { label: "All 150+ Problems", href: "/problems" },
        { label: "Code Templates", href: "/templates" },
        { label: "Algorithm Compare", href: "/compare" },
        { label: "Progress Heatmap", href: "/heatmap" },
      ],
    },
  ];

  const problemFlow = [
    { step: "1", title: "Understand", desc: "Extract inputs, outputs, constraints & edge cases" },
    { step: "2", title: "Think Manually", desc: "Trace small examples by hand before coding" },
    { step: "3", title: "Brute Force", desc: "Formulate naive O(N²) baseline & bottlenecks" },
    { step: "4", title: "Optimize", desc: "Identify optimal patterns and data structures" },
    { step: "5", title: "Final Approach", desc: "Confirm invariant pseudocode & O(N) bounds" },
    { step: "6", title: "Coding & AI Dry Run", desc: "Run Gemini AI simulation with live variable trace" },
    { step: "7", title: "Visualization", desc: "Step-by-step array and pointer animation" },
  ];

  const corePatterns = [
    { name: "Two Pointers", count: 24, badge: "Essential", desc: "Converging or parallel pointers for sorted linear searches." },
    { name: "Sliding Window", count: 18, badge: "High Yield", desc: "Dynamic continuous sub-arrays with O(N) amortized time." },
    { name: "Binary Search", count: 21, badge: "Mastery", desc: "Divide-and-conquer on sorted spaces and monotonicity." },
    { name: "Dynamic Programming", count: 45, badge: "Advanced", desc: "Optimal substructure and overlapping subproblems." },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111827] dark:bg-[#151b23] dark:text-[#f1f5f9] flex flex-col font-sans">
      <Navbar />

      {/* Main Container with Left Sidebar & Content Canvas */}
      <div className="pt-24 flex-1 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 pb-16">
          
          {/* ── Left Sidebar (W3Schools Table of Contents) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-[#f8fafc] dark:bg-[#1e2430] border border-[#e2e8f0] dark:border-[#2e3846] rounded-lg p-4 max-h-[calc(100vh-130px)] overflow-y-auto no-scrollbar shadow-2xs">
              {sidebarSections.map((sec, idx) => (
                <div key={sec.title} className={idx > 0 ? "mt-6 pt-4 border-t border-[#e2e8f0] dark:border-[#2e3846]" : ""}>
                  <h4 className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-2 px-2">
                    {sec.title}
                  </h4>
                  <ul className="space-y-0.5">
                    {sec.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            item.active
                              ? "bg-[#04AA6D] text-white font-bold shadow-xs"
                              : "text-[#334155] dark:text-[#cbd5e1] hover:bg-[#e2e8f0] dark:hover:bg-[#283241] hover:text-[#04AA6D]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main Content Canvas ── */}
          <main className="min-w-0">
            {/* Page Header & Top Breadcrumbs */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#2e3846] pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#64748b] dark:text-[#94a3b8] mb-1">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-[#04AA6D] font-semibold">DSA Tutorial</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                  DSA Tutorial
                </h1>
              </div>

              {/* Bookmark Action */}
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 rounded-md hover:bg-[#f1f5f9] dark:hover:bg-[#1e2430] text-[#04AA6D] transition-colors"
                title="Bookmark this tutorial"
              >
                <Bookmark className={`h-6 w-6 ${isBookmarked ? "fill-[#04AA6D]" : ""}`} />
              </button>
            </div>

            {/* Navigation Pill Buttons (W3Schools < Home & Next >) */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/">
                <Button 
                  variant="outline" 
                  className="font-bold border-[#282A35] dark:border-[#4b5563] text-[#111827] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e2430] px-5 py-2 rounded-md shadow-2xs gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/problems/1">
                <Button 
                  className="bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold px-6 py-2 rounded-md shadow-xs transition-colors gap-1.5"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* ── Signature 2-Column Hero Cards (Matching Screenshot) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              
              {/* Left Card: Learn DSA */}
              <div className="bg-[#f8fafc] dark:bg-[#1c222d] border border-[#e2e8f0] dark:border-[#2e3846] rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-[#04AA6D]/40 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#04AA6D]/15 text-[#04AA6D] flex items-center justify-center">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
                      Learn DSA
                    </h2>
                  </div>

                  <p className="text-sm text-[#374151] dark:text-[#cbd5e1] leading-relaxed mb-4">
                    Data Structures and Algorithms (DSA) is a fundamental part of Computer Science that teaches you how to think and solve complex problems systematically.
                  </p>
                  <p className="text-sm text-[#374151] dark:text-[#cbd5e1] leading-relaxed mb-4">
                    Using the right data structure and algorithm makes your program run faster, especially when working with lots of data.
                  </p>
                  <p className="text-sm text-[#374151] dark:text-[#cbd5e1] leading-relaxed mb-6">
                    Knowing DSA can help you perform better in job interviews and land great software engineering roles in top tech companies.
                  </p>
                </div>

                <Link to={startLearningPath} className="inline-block">
                  <Button className="bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold px-6 py-2.5 rounded-md shadow-xs flex items-center gap-2 transition-all">
                    Learn DSA now
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Right Card: Become DSA Certified */}
              <div className="bg-[#f8fafc] dark:bg-[#1c222d] border border-[#e2e8f0] dark:border-[#2e3846] rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-[#04AA6D]/40 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#282A35] text-white flex items-center justify-center">
                      <Award className="h-6 w-6 text-[#04AA6D]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
                      Become DSA Certified
                    </h2>
                  </div>

                  <p className="text-sm text-[#374151] dark:text-[#cbd5e1] leading-relaxed mb-5">
                    Test your algorithmic reasoning with our structured interview simulator, complete with verified logic traces and step completion validation.
                  </p>

                  {/* Certificate Mockup (from Screenshot) */}
                  <div className="bg-white dark:bg-[#151b23] border border-[#e2e8f0] dark:border-[#2e3846] rounded-lg p-4 mb-6 shadow-2xs relative overflow-hidden">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">Certificate of Completion</span>
                      <h4 className="text-base font-extrabold text-[#111827] dark:text-white mt-1">DSA Logic Master</h4>
                      <p className="text-[11px] text-[#64748b] mt-0.5">Verified Algorithmic Problem Solving</p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#04AA6D]/15 text-[#04AA6D] flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#04AA6D]" />
                        </div>
                        <span className="text-xs font-semibold text-[#04AA6D]">Ready for Tech Interviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/interview" className="inline-block">
                  <Button 
                    variant="outline" 
                    className="border-[#282A35] dark:border-white/40 text-[#111827] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e2430] font-bold px-6 py-2.5 rounded-md shadow-2xs flex items-center gap-2"
                  >
                    Try Interview Mode
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

            </div>

            {/* ── Section: The 7-Step Method ── */}
            <div id="method" className="mb-14 scroll-mt-28">
              <div className="bg-[#f8fafc] dark:bg-[#1c222d] border border-[#e2e8f0] dark:border-[#2e3846] rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#04AA6D] bg-[#04AA6D]/10 px-2 py-0.5 rounded">Core Framework</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
                  The 7-Step Problem Solving Ladder
                </h3>
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6 max-w-2xl">
                  Never freeze up on an unseen question. Each step is locked until you work through the logic step-by-step.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {problemFlow.map((item) => (
                    <div 
                      key={item.step}
                      className="bg-white dark:bg-[#151b23] border border-[#e2e8f0] dark:border-[#2e3846] rounded-lg p-4 hover:border-[#04AA6D] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="w-6 h-6 rounded-md bg-[#04AA6D] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {item.step}
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] dark:text-white group-hover:text-[#04AA6D] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section: AI Dry Run Engine ── */}
            <div id="ai-engine" className="mb-14 scroll-mt-28">
              <div className="border border-[#e2e8f0] dark:border-[#2e3846] bg-white dark:bg-[#1c222d] rounded-xl p-6 sm:p-8 shadow-2xs">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#04AA6D] bg-[#04AA6D]/10 px-2 py-0.5 rounded">
                      Powered by Gemini AI
                    </span>
                    <h3 className="text-2xl font-bold text-[#111827] dark:text-white mt-3 mb-3">
                      Interactive Code Execution & Live Dry Run
                    </h3>
                    <p className="text-sm text-[#374151] dark:text-[#cbd5e1] leading-relaxed mb-4">
                      Write your code in Python, JavaScript, Java, or C++. Our AI dry-run engine steps through your logic line-by-line:
                    </p>
                    <ul className="space-y-2 text-sm text-[#374151] dark:text-[#cbd5e1] mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#04AA6D] shrink-0" />
                        <span><strong>Variable State Inspector:</strong> Watch pointers & counts mutate in real-time.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#04AA6D] shrink-0" />
                        <span><strong>Automatic Bug Spotting:</strong> Detects boundary off-by-one errors and stubs.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#04AA6D] shrink-0" />
                        <span><strong>Complexity Analysis:</strong> Real-time O(N) Time and Space validation.</span>
                      </li>
                    </ul>
                    <Link to="/problems/1">
                      <Button className="bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold px-6 rounded-md">
                        Try AI Dry Run on Two Sum
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  {/* Terminal / Code Dry Run Preview Mockup */}
                  <div className="bg-[#282A35] text-white rounded-lg border border-black/30 p-4 font-mono text-xs shadow-md">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-white/60 text-[11px]">two_sum.py — Step 3 / 8</span>
                      </div>
                      <span className="text-[#04AA6D] font-bold text-[10px] bg-[#04AA6D]/20 px-2 py-0.5 rounded">Running Trace</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-white/40">// Iteration i = 1, num = 7, target = 9</div>
                      <div className="text-[#04AA6D] bg-[#04AA6D]/15 px-2 py-1 rounded border-l-2 border-[#04AA6D]">
                        line 4: complement = target - num  ➔  9 - 7 = 2
                      </div>
                      <div className="text-white/80 pl-2">
                        line 5: if complement in prev_map: ➔ True (index 0)
                      </div>
                      <div className="text-green-400 pl-2">
                        line 6: return [prev_map[complement], i] ➔ [0, 1]
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-white/60">Time: <strong className="text-white">O(N)</strong> • Space: <strong className="text-white">O(N)</strong></span>
                      <span className="text-[#04AA6D] font-bold">✓ Test Passed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section: Core Patterns Library ── */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#111827] dark:text-white">
                    Core Algorithmic Patterns
                  </h3>
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                    15+ algorithmic templates that solve 90% of technical interview questions.
                  </p>
                </div>
                <Link to="/patterns">
                  <Button variant="outline" size="sm" className="font-bold border-[#282A35] dark:border-white/30 text-xs">
                    View All Patterns ❯
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {corePatterns.map((pat) => (
                  <Link key={pat.name} to="/patterns" className="group">
                    <div className="bg-[#f8fafc] dark:bg-[#1c222d] border border-[#e2e8f0] dark:border-[#2e3846] rounded-lg p-5 h-full flex flex-col justify-between hover:border-[#04AA6D] hover:shadow-xs transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold text-[#04AA6D] bg-[#04AA6D]/15 px-1.5 py-0.5 rounded">
                            {pat.badge}
                          </span>
                          <span className="text-xs font-semibold text-[#64748b]">{pat.count} problems</span>
                        </div>
                        <h4 className="text-base font-bold text-[#111827] dark:text-white group-hover:text-[#04AA6D] transition-colors mb-1">
                          {pat.name}
                        </h4>
                        <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                          {pat.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#e2e8f0] dark:border-[#2e3846] flex items-center text-xs font-bold text-[#04AA6D] group-hover:translate-x-1 transition-transform">
                        Explore Pattern ❯
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Navigation Buttons (Like W3Schools bottom row) */}
            <div className="flex items-center justify-between pt-6 border-t border-[#e2e8f0] dark:border-[#2e3846]">
              <Link to="/">
                <Button 
                  variant="outline" 
                  className="font-bold border-[#282A35] dark:border-white/30 text-[#111827] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e2430] px-5 py-2 rounded-md"
                >
                  ❮ Home
                </Button>
              </Link>
              <Link to="/problems">
                <Button 
                  className="bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold px-6 py-2 rounded-md"
                >
                  Browse All Problems ❯
                </Button>
              </Link>
            </div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
