import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Copy, Download, RefreshCw, AlignLeft, Check } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../../../api/axios";
import CoverLetterWritingLoader from "./CoverLetterWritingLoader";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { generateCoverLetterPDF } from "./generateCoverLetterPDF";

const quickActions = [
  {
    id: "regenerate",
    icon: RefreshCw,
    label: "Regenerate",
    helper: "Try a new version",
    instructions: "regenerate",
  },
  {
    id: "shorter",
    icon: AlignLeft,
    label: "Shorter Version",
    helper: "Make it concise",
    instructions: "shorter",
  },
];

interface VersionDetails {
  id: string;
  versionNumber: string;
  generatedText: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const CoverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [versionDetails, setVersionDetails] = useState<VersionDetails>({
    id: "",
    versionNumber: "",
    generatedText: "",
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: coverLetterData, isLoading, isError } = useQuery({
    queryKey: ["coverLetter", id],
    queryFn: () => axiosInstance.get(`/cover-letter/${id}`),
    enabled: !!id
  });

  // Set initial version details when data loads
  useEffect(() => {
    if (coverLetterData?.data.coverLetter) {
      const currentVersion = coverLetterData.data.coverLetter.versions.find(
        (v: VersionDetails) => v.id === coverLetterData.data.coverLetter.currentVersionId
      );
      if (currentVersion) {
        setVersionDetails(currentVersion);
      }
    }
  }, [coverLetterData]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Skeleton className="h-9 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-8">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-[140px]" />
              </div>

              <Skeleton className="min-h-[500px] sm:min-h-[600px] rounded-lg" />
            </div>

            <aside className="space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Failed to load cover letter
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            There was an error loading your cover letter
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/cover-letter")}
              className="text-slate-700 border-slate-200 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to list
            </Button>
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const title = coverLetterData?.data.coverLetter.title || "";
  const wordCount = versionDetails.generatedText
    ? versionDetails.generatedText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(versionDetails.generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handleDownload = () => {
    try {
      generateCoverLetterPDF({
        title,
        content: versionDetails.generatedText,
        fileName: title.replace(/\s+/g, "_"),
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleRegenerate = async (instructions: string) => {
    const data = {
      coverLetterText: versionDetails.generatedText,
      instructions: instructions,
    };

    try {
      setIsRegenerating(true);
      await axiosInstance.post(`/cover-letter/${id}/write`, data);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["coverLetter", id] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message.includes("Monthly limit reached")) {
          navigate("/dashboard/pricing");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleVersionChange = (value: string) => {
    const versionDetail = coverLetterData?.data.coverLetter.versions.find(
      (v: VersionDetails) => v.versionNumber === value
    );

    if (versionDetail) {
      setVersionDetails(versionDetail);
      setSaveStatus("idle");
      setSavedAt(null);
    }
  };

  const handleContentChange = (content: string) => {
    const currentVersionId = versionDetails.id;

    // Update local state immediately
    setVersionDetails((prev) => ({
      ...prev,
      generatedText: content,
    }));
    setSaveStatus("saving");

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce API call
    debounceRef.current = setTimeout(async () => {
      if (!currentVersionId) {
        setSaveStatus("error");
        return;
      }

      try {
        await axiosInstance.patch(
          `/cover-letter/${id}/version/${currentVersionId}`,
          { generatedText: content }
        );
        queryClient.invalidateQueries({ queryKey: ["coverLetter", id] });
        setSaveStatus("saved");
        setSavedAt(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to save changes");
        setSaveStatus("error");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Writing Overlay */}
      {isRegenerating && <CoverLetterWritingLoader />}

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => coverLetterData?.data.coverLetter.isTailoredCoverLetter ? navigate("/dashboard/jobs") : navigate("/dashboard/cover-letter")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="hidden sm:inline text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-8">
          {/* Editor Section */}
          <div className="space-y-4">
            {/* Title & Meta */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </h1>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{wordCount} words</span>
                    <p className="text-[12px] mx-0.5">
                    Auto‑saved while you type
                  </p>
                    {saveStatus === "saving" && (
                      <span>Saving...</span>
                    )}
                    {saveStatus === "saved" && savedAt && (
                      <span className="text-green-600"> Saved at {savedAt} </span>
                    )}
                    {saveStatus === "error" && (
                      <span className="text-red-600"> Save failed !</span>
                    )}
                  </div>

                </div>
              </div>

              <Select
                value={versionDetails.versionNumber}
                onValueChange={handleVersionChange}
              >
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Version" />
                </SelectTrigger>
                <SelectContent>
                  {coverLetterData?.data.coverLetter.versions.map((v: VersionDetails) => (
                    <SelectItem key={v.id} value={v.versionNumber}>
                      Version {v.versionNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text Editor */}
            <Textarea
              autoFocus={true}
              value={versionDetails.generatedText || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[500px] resize-none rounded-lg border border-black bg-background p-4 text-sm leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black sm:min-h-[600px] sm:p-6 sm:text-base"
              placeholder="Your cover letter content..."
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </h2>

              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleRegenerate(action.instructions)}
                      disabled={isRegenerating}
                      className="group flex w-full flex-col gap-1 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-foreground/20 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {action.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {action.helper}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Version Info */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Version
              </h2>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-foreground">
                  Version {versionDetails.versionNumber}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {coverLetterData?.data.coverLetter.versions.length} version
                  {coverLetterData?.data.coverLetter.versions.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CoverDetail;
