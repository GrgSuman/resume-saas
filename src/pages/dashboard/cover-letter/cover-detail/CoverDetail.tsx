import { useState, useEffect, useRef } from "react";
import { ArrowLeft, 
  Download, 
  RefreshCw, AlignLeft, 
  Copy } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../../../api/axios";
import { AxiosError } from "axios";
import CoverLetterWritingLoader from "./CoverLetterWritingLoader";
import { toast } from "react-toastify";

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
  excitement: string;
  achievement: string;
  tone: string;
  generatedText: string;
}

interface CoverLetterData {
  id: number;
  title: string;
  content: string;
  version: string;
  currentVersionId: string;
  versions: VersionDetails[];
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const CoverDetail = () => {
  const { id } = useParams();
  const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [coverLetterData, setCoverLetterData] =
    useState<CoverLetterData | null>(null);
  const [versionDetails, setVersionDetails] = useState<VersionDetails>({
    id: "",
    versionNumber: "",
    excitement: "",
    achievement: "",
    tone: "",
    generatedText: "",
  });

  const navigate = useNavigate();

  const handleRegenerate = async (instructions?: string) => {
    const data = {
      coverLetterText:versionDetails?.generatedText,
      instructions: instructions || "",
      excitement: versionDetails?.excitement,
      achievement: versionDetails?.achievement,
      tone: versionDetails?.tone,
    };

    try {
      setIsWriting(true);
      const response = await axiosInstance.post(
        `/cover-letter/${id}/write`,
        data
      );
      setVersionDetails(response.data.newVersion);
      setCoverLetterData(response.data.updatedCoverLetter);
      toast.success("Cover letter regenerated successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        toast.error("Failed to regenerate cover letter, try again later");
      }
    } finally {
      setIsWriting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchCoverLetter = async () => {
      try {
        const response = await axiosInstance.get(`/cover-letter/${id}`);
        setCoverLetterData(response.data.coverLetter);

        const versionDetail = response.data.coverLetter.versions?.find(
          (x: VersionDetails) =>
            x.id === response.data.coverLetter.currentVersionId
        );
        setVersionDetails(versionDetail);

        if (response.data.coverLetter.status === "pending") {
          setIsCoverLetterLoading(false);
          setIsWriting(true);
          const response = await axiosInstance.post(
            `/cover-letter/${id}/write`,
            {
              excitement: versionDetail?.excitement,
              achievement: versionDetail?.achievement,
              tone: versionDetail?.tone,
            }
          );
            setVersionDetails(response.data.newVersion);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            toast.error("Cover letter not found");
            return navigate("/dashboard");
          }
        }
      } finally {
        setIsCoverLetterLoading(false);
        setIsWriting(false);
      }
    };

    fetchCoverLetter();
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContentChange = (content: string) => {
    const currentVersionId = versionDetails.id;

    setVersionDetails((prev) => ({
      ...prev,
      generatedText: content,
    }));
    setSaveStatus("saving");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!currentVersionId) {
        setSaveStatus("error");
        return;
      }

      try {
        await axiosInstance.patch(
          `/cover-letter/${id}/version/${currentVersionId}`,
          {
            generatedText: content,
          }
        );
        setSaveStatus("saved");
        setSavedAt(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to update cover letter");
        setSaveStatus("error");
      }
    }, 800);
  };

  const handleVersionChange = (value: string) => {
    const versionDetail = coverLetterData?.versions.find(
      (v) => v.versionNumber === value
    );
    setVersionDetails(
      versionDetail || {
        id: "",
        versionNumber: "",
        excitement: "",
        achievement: "",
        tone: "",
        generatedText: "",
      }
    );
  };

  const handleCopy = async () => {
    if (versionDetails?.generatedText) {
      try {
        await navigator.clipboard.writeText(versionDetails.generatedText);
        toast.success("Copied to clipboard!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to copy text");
      }
    }
  };

  const wordCount =
    versionDetails && versionDetails.generatedText
      ? versionDetails.generatedText.trim().split(/\s+/).length
      : 0;

  // Loading state
  if (isCoverLetterLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="h-8 w-40 rounded-full bg-slate-200 animate-pulse" />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
            <div className="space-y-4">
              <div className="h-6 w-64 rounded bg-slate-200 animate-pulse" />
              <div className="h-[520px] rounded-xl border border-slate-200/50 bg-white shadow-sm animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
              <div className="space-y-3 rounded-xl border border-slate-200/50 bg-white p-4 shadow-sm">
                <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
                <div className="h-16 rounded bg-slate-100 animate-pulse" />
                <div className="h-16 rounded bg-slate-100 animate-pulse" />
                <div className="h-10 rounded bg-slate-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Global Writing Overlay */}
      {isWriting && <CoverLetterWritingLoader />}

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              size="sm"
              className="gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm hover:shadow"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        {/* Left Column - Editable Content */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {coverLetterData?.title}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span>{wordCount} words</span>
                {saveStatus === "saved" && savedAt && (
                  <span className="text-emerald-600">Last saved {savedAt}</span>
                )}
                {saveStatus === "error" && (
                  <span className="text-rose-600">Save failed</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={versionDetails?.versionNumber}
                onValueChange={(value) => {
                  handleVersionChange(value);
                }}
              >
                <SelectTrigger className="h-9 w-30 bg-white border-slate-300 hover:border-slate-400 transition-colors">
                  <SelectValue placeholder="Choose version" />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  className="bg-white border-slate-200"
                >
                  {coverLetterData?.versions.map((v) => (
                    <SelectItem
                      key={v.id}
                      value={v.versionNumber}
                      className="focus:bg-slate-50"
                    >
                      Version {v.versionNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={versionDetails?.generatedText}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[600px] whitespace-pre-wrap rounded-xl  bg-white p-4 leading-relaxed text-slate-900 resize-none transition-all duration-200 shadow-sm"
              placeholder="Your cover letter content will appear here..."
            />
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Quick Refinements */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Quick Refinements
            </h2>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleRegenerate(action.instructions)}
                    disabled={isWriting}
                    className="flex w-full flex-col items-start gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <p className="text-xs text-slate-500">{action.helper}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personalization Section */}
          <div className="bg-white space-y-4 p-5 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Personalization
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Add context to make your cover letter more personalized and
                impactful
              </p>
            </div>

            {/* Excitement */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 flex items-center gap-1">
              Why are you interested in this role?
                <span className="text-slate-400 text-xs">(Optional)</span>
              </label>
              <Textarea
                rows={3}
                className="resize-none bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="eg. I like your company’s mission and the role matches what I enjoy doing"
                value={versionDetails?.excitement || ""}
                onChange={(e) =>
                  setVersionDetails({
                    ...versionDetails,
                    excitement: e.target.value,
                  })
                }
              />
            </div>

            {/* Achievement */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 flex items-center gap-1">
              A achievement you’re proud of
                <span className="text-slate-400 text-xs">(Optional)</span>
              </label>
              <Textarea
                rows={3}
                className="resize-none bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="eg. I improved a process, solved a problem, or delivered something valuable."
                value={versionDetails?.achievement}
                onChange={(e) =>
                  setVersionDetails({
                    ...versionDetails,
                    achievement: e.target.value,
                  })
                }
              />
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Tone</label>
              <Select
                value={versionDetails?.tone || ""}
                onValueChange={(value) =>
                  setVersionDetails({ ...versionDetails, tone: value })
                }
              >
                <SelectTrigger className="h-9 text-sm w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Choose tone" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem
                    value="professional"
                    className="focus:bg-slate-50"
                  >
                    Professional
                  </SelectItem>
                  <SelectItem value="modern" className="focus:bg-slate-50">
                    Modern & Direct
                  </SelectItem>
                  <SelectItem value="persuasive" className="focus:bg-slate-50">
                    Confident
                  </SelectItem>
                  <SelectItem
                    value="enthusiastic"
                    className="focus:bg-slate-50"
                  >
                    Enthusiastic
                  </SelectItem>
                  <SelectItem value="empathetic" className="focus:bg-slate-50">
                    Warm & Empathetic
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => handleRegenerate("personalize")}
                disabled={isWriting}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-sm hover:shadow transition-all duration-200 gap-2 h-10 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isWriting ? "animate-spin" : ""}`}
                />
                {isWriting ? "Regenerating..." : "Personalize and Regenerate"}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoverDetail;
