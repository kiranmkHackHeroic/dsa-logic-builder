import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { codeTemplates, CodeTemplate } from "@/data/codeTemplates";
import FeatureLayout from "@/components/layout/FeatureLayout";

const LANGUAGES: Record<string, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

const TemplateCard = ({ template }: { template: CodeTemplate }) => {
  const [selectedLang, setSelectedLang] = useState<keyof typeof template.code>("python");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const code = template.code[selectedLang];

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              {template.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {template.description}
            </p>
          </div>
          <Badge variant="secondary">{template.pattern}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {template.whenToUse.map((useCase) => (
            <Badge key={useCase} variant="outline" className="text-xs">
              {useCase}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Select 
            value={selectedLang} 
            onValueChange={(v) => setSelectedLang(v as keyof typeof template.code)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(code)}
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div
          className={`relative bg-secondary/50 rounded-lg overflow-hidden transition-all ${
            expanded ? "max-h-[600px]" : "max-h-48"
          }`}
        >
          <pre className="p-4 text-sm overflow-auto">
            <code>{code}</code>
          </pre>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <strong>Time:</strong> {template.complexity.time} |{" "}
          <strong>Space:</strong> {template.complexity.space}
        </div>
      </CardContent>
    </Card>
  );
};

const CodeTemplatesPage = () => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const patterns = [...new Set(codeTemplates.map((t) => t.pattern))];

  const filteredTemplates = selectedPattern
    ? codeTemplates.filter((t) => t.pattern === selectedPattern)
    : codeTemplates;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Code className="h-8 w-8 text-primary" />
          Code Templates
        </h1>
        <p className="text-muted-foreground">
          Ready-to-use algorithm patterns in multiple programming languages
        </p>
      </div>

      {/* Pattern Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPattern === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPattern(null)}
            >
              All Patterns
            </Button>
            {patterns.map((pattern) => (
              <Button
                key={pattern}
                variant={selectedPattern === pattern ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPattern(pattern)}
              >
                {pattern}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

const CodeTemplatesPageWithLayout = () => (
  <FeatureLayout>
    <CodeTemplatesPage />
  </FeatureLayout>
);

export default CodeTemplatesPageWithLayout;
