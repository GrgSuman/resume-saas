import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Alert, AlertDescription } from "../../../../../components/ui/alert";
import {
  X,
  Target,
  AlertCircle,
  Sparkles,
  FileText,
  ChevronDown,
  History,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import AnalysisCard from "./AnalysisCard";
import { useResume } from "../../../../../hooks/useResume";
import axiosInstance from "../../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import type { ResumeAnalysis } from "../../../types/resumeAnalysis";
import { useParams } from "react-router";

interface AnalyzerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openJobDescDialog?: boolean;
  onJobDescDialogChange?: (open: boolean) => void;
}

const Analyzer = ({
  open,
  onOpenChange,
  openJobDescDialog,
  onJobDescDialogChange,
}: AnalyzerProps) => {
  const { state, dispatch } = useResume();
  const { id } = useParams();
  const [internalJobDescDialog, setInternalJobDescDialog] = useState(false);
  const [tempJobDescription, setTempJobDescription] = useState("");
  const [previousAnalyses, setPreviousAnalyses] = useState<ResumeAnalysis[]>(
    state.resumeAnalysis || []
  );
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  // Use global state for job description
  const jobDescription = state.jobDescription || "";
  const hasJobDescription = jobDescription.trim().length > 0;
  const jobDescriptionWordCount = jobDescription.trim()
    ? jobDescription
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;

  // Use external control if provided, otherwise use internal state
  const showJobDescDialog =
    openJobDescDialog !== undefined ? openJobDescDialog : internalJobDescDialog;
  const setShowJobDescDialog =
    onJobDescDialogChange || setInternalJobDescDialog;

  // Initialize tempJobDescription when dialog opens
  useEffect(() => {
    if (showJobDescDialog) {
      setTempJobDescription(jobDescription);
    }
  }, [showJobDescDialog, jobDescription]);

  const mostRecentAnalysis = previousAnalyses[0];
  const olderAnalyses = previousAnalyses.slice(1);

  const handleStartAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/resume/${id}/analyze-resume`,
        {
          jobDescription: jobDescription,
          resumeData: state.resumeData,
        }
      );
      setPreviousAnalyses([response.data.analysis, ...previousAnalyses]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if(error?.response?.data?.message.includes("Monthly limit reached")){
          toast.error(error?.response?.data?.message, {
            position: "top-right",
          });
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenJobDescDialog = () => {
    setTempJobDescription(jobDescription); // Initialize with global state
    setShowJobDescDialog(true);
  };

  const handleSaveJobDescription = () => {
    const trimmedValue = tempJobDescription.trim();

    // Don't allow adding empty (if global is empty and trying to add empty)
    if (!hasJobDescription && trimmedValue.length === 0) {
      return; // Don't save empty when adding
    }

    // Allow updating to empty (clearing existing job description)
    // Dispatch to global state
    dispatch({
      type: "SET_JOB_DESCRIPTION",
      payload: trimmedValue,
    });
    setShowJobDescDialog(false);
  };

  const handleCloseJobDescDialog = () => {
    // Revert to global state value on cancel
    setTempJobDescription(jobDescription);
    setShowJobDescDialog(false);
  };

  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      await axiosInstance.delete(`/resume/${id}/clear-history`);
      // Keep only the most recent analysis, remove all older ones
      if (mostRecentAnalysis) {
        setPreviousAnalyses([mostRecentAnalysis]);
        setShowHistory(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Failed to clear history. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setIsClearingHistory(false);
    }
  };

  return (
    <>
      {/* Job Description Dialog */}
      <Dialog open={showJobDescDialog} onOpenChange={handleCloseJobDescDialog}>
        <DialogContent
          aria-describedby="add description for better recommendations"
          title="Add Job Description"
          showCloseButton={false}
          className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0"
        >
          <DialogTitle className="sr-only">Add Job Description</DialogTitle>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {hasJobDescription
                  ? "Update Job Description"
                  : "Add Job Description"}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Paste the full job posting for tailored recommendations
              </p>
            </div>
            <button
              onClick={handleCloseJobDescDialog}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <textarea
              value={tempJobDescription}
              onChange={(e) => setTempJobDescription(e.target.value)}
              placeholder="Paste the complete job description here including job title, responsibilities, qualifications, and required skills..."
              className="w-full min-h-[360px] p-4 text-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background leading-relaxed transition-shadow"
            />
            <p className="flex items-start gap-2 text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                More details = better keyword matching and tailored
                recommendations
              </span>
            </p>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseJobDescDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveJobDescription}
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={
                !hasJobDescription && tempJobDescription.trim().length === 0
              }
            >
              {hasJobDescription ? "Update" : "Add"} Job Description
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Analyzer Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          aria-describedby="get actionable feedback to improve your resume"
          title=""
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
          className="min-w-[80%] h-[98%] border-0 p-0 overflow-hidden rounded-xl flex flex-col bg-white gap-0"
        >
          <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Resume Analysis
              </h3>
              <p className="text-sm text-slate-500">
                Get actionable feedback to improve your resume
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto space-y-6">
              {/* Job Description Section - Always Visible */}
              {!hasJobDescription && (
                <Alert className="border-slate-200 bg-slate-50">
                    <FileText className="h-4 w-4 text-slate-600 mt-1" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">
                      Add a target job description for better recommendations,
                      keyword matching, analysis and chat responses.
                    </span>
                    <Button
                      onClick={handleOpenJobDescDialog}
                      size="sm"
                      variant="outline"
                      className="ml-4"
                    >
                      <Target className="h-3.5 w-3.5 mr-1.5" />
                      Add Job
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {hasJobDescription && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-600" />
                    <div>
                      <span className="text-sm font-medium text-slate-900">
                        Target job description added
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        ({jobDescriptionWordCount}{" "}
                        {jobDescriptionWordCount === 1 ? "word" : "words"})
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleOpenJobDescDialog}
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                  >
                    Edit
                  </Button>
                </div>
              )}

              {/* Show full loading only when no existing analyses (first time) */}
              {isLoading && previousAnalyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">
                      Analyzing your resume...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              ) : (
              <div className="space-y-4">
                {/* Most Recent Analysis - Always Visible */}
                {mostRecentAnalysis && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900">
                          Latest Analysis
                        </h4>
                        <div className="flex items-center gap-2">
                      {olderAnalyses.length > 0 && (
                            <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowHistory(!showHistory)}
                          className="text-xs"
                        >
                          <History className="h-3.5 w-3.5 mr-1.5" />
                                {showHistory
                                  ? "Hide Past Analyses"
                                  : `View ${olderAnalyses.length} Past ${
                                      olderAnalyses.length === 1
                                        ? "Analysis"
                                        : "Analyses"
                                    }`}
                          <ChevronDown
                            className={`h-3.5 w-3.5 ml-1.5 transition-transform ${
                              showHistory ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearHistory}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Clear old analysis history"
                              >
                                {isClearingHistory ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    Clear History
                                  </>
                                )}
                              </Button>
                            </>
                      )}
                    </div>
                      </div>
                      <AnalysisCard
                        key={mostRecentAnalysis.id}
                        analysis={mostRecentAnalysis}
                        defaultExpanded={true}
                      />
                  </div>
                )}

                {/* History Section - Toggleable */}
                {showHistory && olderAnalyses.length > 0 && (
                  <div className="space-y-4">
                    {olderAnalyses.map((analysis) => (
                        <AnalysisCard
                          key={analysis.id}
                          analysis={analysis}
                          defaultExpanded={false}
                        />
                    ))}
                  </div>
                )}

                {/* Empty State - Only show if no analyses at all */}
                {previousAnalyses.length === 0 && (
                  <div className="border border-slate-200 rounded-lg bg-white p-6">
                    <div className="text-center max-w-md mx-auto">
                        <h5 className="text-lg font-medium text-slate-900 mb-2">
                          No analysis history
                        </h5>
                      <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                          Get started for detailed feedback on ATS optimization,
                          strengths, areas for improvement, and actionable
                          recommendations.
                        </p>
                        <Button
                          onClick={handleStartAnalysis}
                          size="sm"
                          disabled={isLoading}
                          className="bg-gray-900 text-white font-medium text-xs hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        Create New Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
            <Button 
              onClick={handleStartAnalysis} 
              disabled={isLoading}
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
              Create New Analysis
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Analyzer;
