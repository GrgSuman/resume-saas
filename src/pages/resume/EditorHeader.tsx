import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, Download, Eye, Edit3, Menu } from "lucide-react";
import { useResume } from "../../hooks/useResume";
import { useNavigate } from "react-router";

interface EditorHeaderProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
  onSectionsClick: () => void;
}

const EditorHeader = ({ resumeRef, onSectionsClick }: EditorHeaderProps) => {
  const { state, dispatch } = useResume();
  const navigate = useNavigate();
  const [shouldDownload, setShouldDownload] = useState(false);

  useEffect(() => {
    const downloadPDF = async (htmlContent: string) => {
      const res = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
        body: JSON.stringify({ htmlContent }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      setShouldDownload(false);
      dispatch({ type: 'SET_DOWNLOADING', payload: false });
    };

    if (resumeRef.current && !state?.resumeEditingMode && shouldDownload) {
      dispatch({ type: 'SET_DOWNLOADING', payload: true });
      const html = resumeRef.current.innerHTML;
      downloadPDF(html);
    }
  }, [state?.resumeEditingMode, shouldDownload, resumeRef, dispatch]);

  const handleDownloadPDF = () => {
    dispatch({ type: 'SET_EDITING_MODE', payload: false });
    setShouldDownload(true);
  };

  const toggleEditMode = () => {
    dispatch({ type: 'SET_EDITING_MODE', payload: !state?.resumeEditingMode });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left - Navigation & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Center - Resume Controls */}
        <div className="flex items-center gap-4">
          {/* Template */}
          <div className="flex items-center gap-2">
            <Select
              value={state.resumeSettings?.template || "Creative"}
              onValueChange={(value) => dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { template: value } })}
            >
              <SelectTrigger className="h-9 w-[140px] border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-800">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                <SelectItem value="Creative" className="hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    Creative
                  </div>
                </SelectItem>
                <SelectItem value="Professional" className="hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    Professional
                  </div>
                </SelectItem>
                <SelectItem value="Two Column" className="hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    Two Column
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font */}
          <div className="flex items-center gap-2">
            <Select
              value={state.resumeSettings?.fontFamily || "sans-serif"}
              onValueChange={(value) => dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { fontFamily: value } })}
            >
              <SelectTrigger className="h-9 w-[100px] border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-800">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                <SelectItem value="sans-serif" className="hover:bg-gray-50">Sans</SelectItem>
                <SelectItem value="serif" className="hover:bg-gray-50">Serif</SelectItem>
                <SelectItem value="monospace" className="hover:bg-gray-50">Mono</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size */}
          <div className="flex items-center gap-2">
            <Select
              value={state.resumeSettings?.fontSize?.toString() || "14"}
              onValueChange={(value) => dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { fontSize: parseInt(value) } })}
            >
              <SelectTrigger className="h-9 w-[80px] border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-800">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                <SelectItem value="12" className="hover:bg-gray-50">12</SelectItem>
                <SelectItem value="13" className="hover:bg-gray-50">13</SelectItem>
                <SelectItem value="14" className="hover:bg-gray-50">14</SelectItem>
                <SelectItem value="15" className="hover:bg-gray-50">15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Sections Button */}
          <Button
            onClick={onSectionsClick}
            variant="outline"
            size="sm"
            className="gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300"
          >
            <Menu className="h-4 w-4" />
            Sections
          </Button>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Edit Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                state?.resumeEditingMode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                !state?.resumeEditingMode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>

          {/* Download */}
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={state?.resumeDownloading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            {state?.resumeDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;