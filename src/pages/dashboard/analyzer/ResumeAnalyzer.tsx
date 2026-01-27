import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Loader2, Upload, FileText, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

interface AnalysisResult {
  jobMatchPercentage?: number;
  atsScore: number;
  summary: string;
  overallInsights: string[];
  priorityActions: Array<{
    action: string;
    impact: string;
    section: string;
  }>;
  missingKeywords?: string[];
}

const ResumeAnalyzer = () => {
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  // Fetch resumes
  const { data: mainResumes, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/"),
  });

  // Auto-select first resume when available
  useEffect(() => {
    if (mainResumes?.data?.resumes?.length > 0 && !selectedResume) {
      setSelectedResume(mainResumes?.data?.resumes[0].id);
    }
  }, [mainResumes, selectedResume]);

  const handleAnalyze = async () => {
    if (!selectedResume) return;
    setIsAnalyzing(true);
    // Simulate analysis - replace with actual API call
    setTimeout(() => {
      setAnalysisResult({
        jobMatchPercentage: 78,
        atsScore: 85,
        summary: "Your resume shows strong alignment with the job requirements. There are a few areas where you can strengthen your match.",
        overallInsights: [
          "Strong technical skills match",
          "Experience aligns well with job requirements",
          "Some missing keywords from job description"
        ],
        priorityActions: [
          {
            action: "Add React Native experience",
            impact: "High",
            section: "Skills"
          },
          {
            action: "Highlight team leadership experience",
            impact: "Medium",
            section: "Experience"
          }
        ],
        missingKeywords: ["React Native", "Agile", "CI/CD"]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setJobDescription("");
  };

  return (
    <div className='max-w-7xl mx-auto mt-10 px-6'>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Resume Analyzer
          </h1>
          <p className="text-sm text-slate-500">
            Analyze your resume and get actionable insights. Add a job description for job matching analysis.
          </p>
        </div>

        {!analysisResult ? (
          <div className="space-y-6">
            {/* Resume Selection */}
            <div className="border border-slate-200 rounded-xl bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Select Resume
              </h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8 border border-slate-200 rounded-lg bg-slate-50">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : mainResumes?.data?.resumes?.length === 0 ? (
                <div className="text-center py-12 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-sm text-slate-400">No resumes available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {mainResumes?.data?.resumes?.map((resume: { id: string; title: string; emoji: string }) => (
                    <button
                      key={resume.id}
                      type="button"
                      onClick={() => setSelectedResume(resume.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border",
                        selectedResume === resume.id
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      <span className="text-2xl">{resume.emoji || "📄"}</span>
                      <span className="text-sm font-medium line-clamp-1 flex-1 text-slate-900">
                        {resume.title}
                      </span>
                      {selectedResume === resume.id && (
                        <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Upload Option */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUpload(!showUpload)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {showUpload ? "Cancel Upload" : "Upload Resume"}
                </button>
                {showUpload && (
                  <div className="mt-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500 mb-2">Upload functionality coming soon</p>
                    <input type="file" accept=".pdf,.doc,.docx" className="text-xs" disabled />
                  </div>
                )}
              </div>
            </div>

            {/* Job Description (Optional) */}
            <div className="border border-slate-200 rounded-xl bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">
                    Job Description <span className="text-sm font-normal text-slate-500">(Optional)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Paste the job description for job matching analysis
                  </p>
                </div>
              </div>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here including job title, responsibilities, qualifications, and required skills..."
                className="min-h-[200px] text-sm resize-none shadow-none"
              />
              {jobDescription && (
                <p className="text-xs text-slate-500 mt-2">
                  {jobDescription.trim().split(/\s+/).filter((word) => word.length > 0).length} words
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedResume || isAnalyzing}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            {/* Header with Reset */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Analysis Results</h2>
                <p className="text-sm text-slate-500 mt-1">Actionable insights to improve your resume</p>
              </div>
              <Button
                variant="outline"
                onClick={handleReset}
                size="sm"
              >
                New Analysis
              </Button>
            </div>

            {/* Job Match Score */}
            {jobDescription && (
              <div className="border border-slate-200 rounded-xl bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-semibold text-slate-900">Job Match Analysis</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-900">{analysisResult.jobMatchPercentage}%</div>
                    <div className="text-xs text-slate-500">Match Score</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${analysisResult.jobMatchPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 mt-4">{analysisResult.summary}</p>
              </div>
            )}

            {/* ATS Score */}
            <div className="border border-slate-200 rounded-xl bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">ATS Score</h3>
                </div>
                <div className="text-2xl font-bold text-slate-900">{analysisResult.atsScore}/100</div>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${analysisResult.atsScore}%` }}
                />
              </div>
            </div>

            {/* Overall Insights */}
            <div className="border border-slate-200 rounded-xl bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Overall Insights</h3>
              <div className="space-y-3">
                {analysisResult.overallInsights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 flex-1">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Actions */}
            <div className="border border-slate-200 rounded-xl bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Priority Actions</h3>
              <div className="space-y-4">
                {analysisResult.priorityActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900">{action.action}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          action.impact === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {action.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Section: {action.section}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            {jobDescription && analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
              <div className="border border-slate-200 rounded-xl bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-semibold text-slate-900">Missing Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingKeywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Consider adding these keywords naturally throughout your resume to improve job match
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
