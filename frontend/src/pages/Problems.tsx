import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAllProgress } from "@/hooks/useProblemProgress";
import { useAuth } from "@/contexts/AuthContext";
import { COMPANY_PROBLEMS } from "@/data/companyProblems";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const toLeetCodeSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const buildLeetCodeUrl = (title: string) => `https://leetcode.com/problems/${toLeetCodeSlug(title)}/`;

const problems = COMPANY_PROBLEMS.filter((problem) => problem.striverSheet).map((problem) => ({
  id: problem.id,
  title: problem.title,
  difficulty: problem.difficulty,
  pattern: problem.concept,
  companies: problem.companies,
  localProblemId: problem.localProblemId,
  routeId: problem.localProblemId ? String(problem.localProblemId) : `company-${problem.id}`,
  leetcodeUrl: problem.leetcodeUrl || buildLeetCodeUrl(problem.title),
}));

const formatCompanyName = (company: string) => company.charAt(0).toUpperCase() + company.slice(1);

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: allProgress } = useAllProgress();

  const progressMap = new Map<string, string>();
  if (allProgress) {
    allProgress.forEach((p) => {
      progressMap.set(p.problem_id, p.status);
    });
  }

  const getStatus = (routeId: string) => {
    if (!user) return "pending";
    const dbStatus = progressMap.get(routeId);
    if (dbStatus === "completed") return "completed";
    if (dbStatus === "in_progress" || dbStatus === "in-progress") return "in-progress";
    return "pending";
  };

  const patterns = [...new Set(problems.map((p) => p.pattern))];

  const filteredProblems = problems.filter((problem) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      problem.title.toLowerCase().includes(query) || problem.pattern.toLowerCase().includes(query);
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesPattern = !selectedPattern || problem.pattern === selectedPattern;
    return matchesSearch && matchesDifficulty && matchesPattern;
  });

  const completed = problems.filter((p) => getStatus(p.routeId) === "completed").length;
  const inProgress = problems.filter((p) => getStatus(p.routeId) === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Problem Library</h1>
            <p className="text-muted-foreground">
              Full Striver sheet across concepts, with guided steps where available
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{problems.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card variant="elevated" className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems or concepts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                  >
                    All
                  </Button>
                  {["easy", "medium", "hard"].map((diff) => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Concepts:
                </span>
                <Button
                  variant={selectedPattern === null ? "step-active" : "step"}
                  size="sm"
                  onClick={() => setSelectedPattern(null)}
                >
                  All
                </Button>
                {patterns.map((pattern) => (
                  <Button
                    key={pattern}
                    variant={selectedPattern === pattern ? "step-active" : "step"}
                    size="sm"
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    {pattern}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filteredProblems.map((problem) => {
              const status = getStatus(problem.routeId);
              const internalPath = `/problems/${problem.routeId}`;

              return (
                <Card key={problem.id} variant="interactive" className="group">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <Link to={internalPath} className="flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                          <div
                            className={`
                              w-10 h-10 rounded-lg flex items-center justify-center
                              ${
                                status === "completed"
                                  ? "bg-success/10"
                                  : status === "in-progress"
                                    ? "bg-warning/10"
                                    : "bg-muted"
                              }
                            `}
                          >
                            {status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : status === "in-progress" ? (
                              <Clock className="h-5 w-5 text-warning" />
                            ) : (
                              <Target className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold group-hover:text-primary transition-colors">
                                {problem.id}. {problem.title}
                              </p>
                              <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {problem.pattern}
                              </span>
                              <div className="flex gap-1">
                                {problem.companies.slice(0, 2).map((company) => (
                                  <Badge key={company} variant="secondary" className="text-xs">
                                    {formatCompanyName(company)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 ml-3">
                        <a
                          href={problem.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${problem.title} on LeetCode`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Problems;
