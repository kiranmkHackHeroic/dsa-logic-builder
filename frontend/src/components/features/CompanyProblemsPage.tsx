import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Search,
  ExternalLink,
  TrendingUp,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import FeatureLayout from "@/components/layout/FeatureLayout";
import {
  COMPANY_LOGOS,
  COMPANY_PROBLEMS,
  STRIVER_CONCEPTS,
  type CompanyProblem,
} from "@/data/companyProblems";

type SortOption = "frequency" | "difficulty";

const CompanyLogo = ({
  name,
  logoUrl,
  size = "large",
}: {
  name: string;
  logoUrl: string;
  size?: "small" | "large";
}) => {
  const classes =
    size === "small"
      ? "w-6 h-6 rounded-full"
      : "w-12 h-12 rounded-xl";

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={`${classes} object-contain bg-background border p-1`}
      loading="lazy"
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
      }}
    />
  );
};

const CompanyProblemsPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedConcept, setSelectedConcept] = useState<string>("all");
  const [striverOnly, setStriverOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("frequency");

  const filteredProblems = COMPANY_PROBLEMS.filter((problem) => {
    const matchesCompany =
      !selectedCompany || problem.companies.includes(selectedCompany);
    const matchesDifficulty =
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    const matchesConcept =
      selectedConcept === "all" || problem.concept === selectedConcept;
    const matchesSheet = !striverOnly || problem.striverSheet;
    const matchesSearch =
      !searchQuery ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.concept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCompany && matchesDifficulty && matchesConcept && matchesSheet && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "frequency") return b.frequency - a.frequency;
    const diffOrder = { easy: 0, medium: 1, hard: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  const selectedCompanyData = COMPANY_LOGOS.find((c) => c.id === selectedCompany);

  const getProblemRoute = (problem: CompanyProblem) => {
    if (problem.localProblemId) {
      return `/problems/${problem.localProblemId}`;
    }
    return problem.leetcodeUrl || "#";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          Company Problems
        </h1>
        <p className="text-muted-foreground">
          Practice company-wise problems with Striver sheet concept mapping
        </p>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {COMPANY_LOGOS.map((company) => (
          <Card
            key={company.id}
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              selectedCompany === company.id ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() =>
              setSelectedCompany(
                selectedCompany === company.id ? null : company.id
              )
            }
          >
            <CardContent className="pt-4 text-center">
              <div className="flex justify-center mb-2">
                <CompanyLogo name={company.name} logoUrl={company.logoUrl} />
              </div>
              <h3 className="font-semibold text-sm">{company.name}</h3>
              <p className="text-xs text-muted-foreground">
                {company.problems} problems
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Company Info */}
      {selectedCompanyData && (
        <Card className={`${selectedCompanyData.color}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CompanyLogo name={selectedCompanyData.name} logoUrl={selectedCompanyData.logoUrl} />
                <div>
                  <h2 className="text-xl font-bold">{selectedCompanyData.name}</h2>
                  <p className="text-sm opacity-80">
                    {selectedCompanyData.problems} problems in database
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {filteredProblems.length}
                  </p>
                  <p className="text-xs opacity-80">Matching</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedConcept} onValueChange={setSelectedConcept}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Concept" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Concepts</SelectItem>
                {STRIVER_CONCEPTS.map((concept) => (
                  <SelectItem key={concept} value={concept}>
                    {concept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frequency">Frequency</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant={striverOnly ? "default" : "outline"}
              onClick={() => setStriverOnly((prev) => !prev)}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Striver Sheet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem) => (
          <Card
            key={problem.id}
            className="group hover:border-primary/30 transition-all"
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    #{problem.id}
                  </div>
                  <div>
                    <h3 className="font-semibold">{problem.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={problem.difficulty}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                          {problem.concept}
                      </span>
                        {problem.striverSheet && (
                          <Badge variant="outline" className="text-xs">
                            Striver
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{problem.frequency}%</span>
                  </div>
                  <div className="flex -space-x-1">
                    {problem.companies.slice(0, 4).map((companyId) => {
                      const company = COMPANY_LOGOS.find((c) => c.id === companyId);
                      return (
                        <div
                          key={companyId}
                          className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-2 border-background text-[10px] overflow-hidden"
                          title={company?.name}
                        >
                          {company ? (
                            <CompanyLogo name={company.name} logoUrl={company.logoUrl} size="small" />
                          ) : (
                            companyId.slice(0, 1).toUpperCase()
                          )}
                        </div>
                      );
                    })}
                    {problem.companies.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-2 border-background text-xs">
                        +{problem.companies.length - 4}
                      </div>
                    )}
                  </div>
                  <Link to={getProblemRoute(problem)} target={problem.localProblemId ? undefined : "_blank"} rel={problem.localProblemId ? undefined : "noreferrer"}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title={problem.localProblemId ? "Open guided page" : "Open problem link"}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CompanyProblemsPageWithLayout = () => (
  <FeatureLayout>
    <CompanyProblemsPage />
  </FeatureLayout>
);

export default CompanyProblemsPageWithLayout;
