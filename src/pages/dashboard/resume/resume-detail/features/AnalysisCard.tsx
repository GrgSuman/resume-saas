import { useState, useRef } from "react";
import {
  ChevronDown,
  Clock,
  Target,
  XCircle,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  FileText,
} from "lucide-react";
import type { ResumeAnalysis } from "../../../types/resumeAnalysis";
import { formatRelativeTime } from "../../../../../lib/utils";

interface AnalysisCardProps {
  analysis: ResumeAnalysis;
  defaultExpanded?: boolean;
}

/* ===================== HELPERS ===================== */
const getSectionHeaderStyle = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-500/10 border-green-500/30";
    case "good":
      return "bg-blue-500/10 border-blue-500/30";
    case "needs-improvement":
      return "bg-amber-500/10 border-amber-500/30";
    case "critical":
      return "bg-red-500/10 border-red-500/30";
    default:
      return "bg-muted";
  }
};

const StatusDot = ({ status }: { status: string }) => {
  const color =
    status === "excellent"
      ? "bg-green-500"
      : status === "good"
      ? "bg-blue-500"
      : status === "needs-improvement"
      ? "bg-amber-500"
      : "bg-red-500";

  return <span className={`w-2.5 h-2.5 rounded-full ${color}`} />;
};

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 22;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "stroke-green-500"
      : score >= 60
      ? "stroke-amber-500"
      : "stroke-red-500";

  return (
    <div className="relative w-14 h-14">
      <svg className="rotate-[-90deg]" width="56" height="56">
        <circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth={stroke}
          className="stroke-muted/30"
          fill="none"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all`}
          fill="none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {score}
      </span>
    </div>
  );
};

/* ===================== COMPONENT ===================== */

const AnalysisCard = ({
  analysis,
  defaultExpanded = false,
}: AnalysisCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [showJobDescription, setShowJobDescription] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleSection = (key: string) => {
    const copy = new Set(openSections);
    const isOpening = !copy.has(key);
    
    if (copy.has(key)) {
      copy.delete(key);
    } else {
      copy.add(key);
    }
    setOpenSections(copy);

    // Scroll to section when opening
    if (isOpening) {
      setTimeout(() => {
        const sectionElement = sectionRefs.current[key];
        if (sectionElement) {
          sectionElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  const missingKeywords = analysis.missingKeywords || [];

  /* ===================== RENDER ===================== */

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      {/* HEADER */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 cursor-pointer hover:bg-muted/30 transition"
      >
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <ScoreRing score={analysis.atsScore} />
            <span className="text-xs text-muted-foreground font-medium">
              ATS
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              {analysis.createdAt
                ? formatRelativeTime(analysis.createdAt)
                : "N/A"}
              {analysis.jobTitle && (
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {analysis.jobTitle}
                </span>
              )}
              {analysis.jobMatchPercentage !== undefined && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                  {analysis.jobMatchPercentage}% Job Match
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* BODY */}
      {expanded && (
        <div className="border-t">
          {/* INSIGHTS */}
          {analysis.overallInsights?.length > 0 && (
            <div className="p-4">
              <h4 className="font-medium mb-2">Overall Insights</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {analysis.overallInsights.map((i, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-1 text-primary" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* JOB DESCRIPTION */}
          <div className="p-4 border-t bg-blue-300/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">Job Description</h4>
                  {analysis.jobTitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {analysis.jobTitle}
                    </p>
                  )}
                </div>
              </div>
              {analysis.jobDescription && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowJobDescription(!showJobDescription);
                  }}
                  className="p-1.5 rounded-md hover:bg-background/50 transition-colors flex items-center gap-1"
                  title={
                    showJobDescription
                      ? "Hide job description"
                      : "Show job description"
                  }
                >
                  <span className="text-xs text-muted-foreground">
                    {showJobDescription ? "Hide" : "Show"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      showJobDescription ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
            {showJobDescription && analysis.jobDescription && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {analysis.jobDescription}
              </p>
            )}
          </div>

          {/* MISSING KEYWORDS */}
          {missingKeywords.length > 0 && (
            <div className="p-4 border-t bg-amber-500/5">
              <h4 className="text-sm font-medium mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((k) => (
                  <span
                    key={k}
                    className="px-2 py-0.5 border rounded text-sm bg-card"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PRIORITY ACTIONS */}
          {analysis.priorityActions?.length > 0 && (
            <div className="p-4 border-t">
              <h4 className="text-sm font-medium mb-3">Priority Actions</h4>
              <div className="space-y-2">
                {analysis.priorityActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Impact:</span>{" "}
                          {action.impact}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Section:</span>{" "}
                          {action.section}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h4 className="p-4 pb-0 font-medium">Section Analysis</h4>
          {/* SECTION OVERVIEW */}
          <div className="p-4 mb-4 bg-muted/30 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {analysis.sectionAnalysis.map((s) => (
              <button
                key={s.sectionKey}
                onClick={() => toggleSection(s.sectionKey)}
                className={`flex items-center gap-2 p-3 rounded-lg border transition ${
                  openSections.has(s.sectionKey)
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/40"
                }`}
              >
                <StatusDot status={s.status} />
                <span className="text-xs font-medium flex-1 text-left truncate">
                  {s.sectionName}
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition ${
                    openSections.has(s.sectionKey) ? "rotate-90" : ""
                  }`}
                />
              </button>
            ))}
          </div>

          {/* SECTION DETAILS */}
          {analysis.sectionAnalysis
            .filter((s) => openSections.has(s.sectionKey))
            .map((section) => (
              <div
                key={section.sectionKey}
                ref={(el) => {
                  sectionRefs.current[section.sectionKey] = el;
                }}
                className="bg-background space-y-2"
              >
                {/* APP BAR HEADER */}
                <div
                  className={`sticky top-0 z-10 px-4 py-3 flex items-center justify-between ${getSectionHeaderStyle(
                    section.status
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <StatusDot status={section.status} />
                    <div>
                      <h4 className="text-sm font-semibold">
                        {section.sectionName}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        Score: {section.score}/100
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSection(section.sectionKey)}
                    className="p-2 rounded-full hover:bg-background/50"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-5">
                  {section.missingElements?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Missing</h5>
                      <ul className="ml-4 list-disc text-sm text-muted-foreground space-y-1">
                        {section.missingElements.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.issues?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Issues</h5>
                      <div className="space-y-2">
                        {section.issues.map((i, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border bg-muted/40"
                          >
                            <p className="text-sm font-medium">{i.issue}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {i.impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.recommendations?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Recommendations</h5>
                      <div className="space-y-2">
                        {section.recommendations.map((r, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border bg-card"
                          >
                            <p className="text-sm font-medium">{r.action}</p>
                            {r.example && (
                              <pre className="mt-2 p-2 text-sm bg-muted rounded whitespace-pre-wrap">
                                {r.example}
                              </pre>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              {r.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
