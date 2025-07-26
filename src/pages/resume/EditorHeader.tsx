import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
      const res = await fetch(`https://server.clonecv.com/generate-pdf`, {
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
      dispatch({ type: "SET_DOWNLOADING", payload: false });
    };

    if (resumeRef.current && !state?.resumeEditingMode && shouldDownload) {
      dispatch({ type: "SET_DOWNLOADING", payload: true });
      const html = resumeRef.current.innerHTML;
      downloadPDF(html);
    }
  }, [state?.resumeEditingMode, shouldDownload, resumeRef, dispatch]);

  const handleDownloadPDF = () => {
    dispatch({ type: "SET_EDITING_MODE", payload: false });
    setShouldDownload(true);
  };

  const toggleEditMode = () => {
    dispatch({ type: "SET_EDITING_MODE", payload: !state?.resumeEditingMode });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black/20 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left - Back Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2 font-semibold text-xs uppercase border-2 border-black/20   h-9 px-3 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
        </div>

        {/* Center - Document Controls */}
        <div className="flex items-center gap-2">
          {/* Template Selector */}
          <Select
            value={state.resumeSettings?.template || "Creative"}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_RESUME_SETTINGS",
                payload: { template: value },
              })
            }
          >
            <SelectTrigger className="h-9 border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black bg-white">
              <SelectItem value="Creative" className="hover:bg-black hover:text-white font-semibold text-xs">Creative</SelectItem>
              <SelectItem value="Professional" className="hover:bg-black hover:text-white font-semibold text-xs">Professional</SelectItem>
              <SelectItem value="Two Column" className="hover:bg-black hover:text-white font-semibold text-xs">Two Column</SelectItem>
            </SelectContent>
          </Select>

          {/* Font Selector */}
          <Select
            value={state.resumeSettings?.fontFamily || "Roboto"}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_RESUME_SETTINGS",
                payload: { fontFamily: value },
              })
            }
          >
            <SelectTrigger className="h-9 border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black bg-white">
              <SelectItem value="Roboto" className="hover:bg-black hover:text-white font-semibold text-xs">Sans</SelectItem>
              <SelectItem value="PT Serif" className="hover:bg-black hover:text-white font-semibold text-xs">Serif</SelectItem>
            </SelectContent>
          </Select>

          {/* Size Selector */}
          <Select
            value={state.resumeSettings?.fontSize?.toString() || "14"}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_RESUME_SETTINGS",
                payload: { fontSize: parseInt(value) },
              })
            }
          >
            <SelectTrigger className="h-9  border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black bg-white">
              <SelectItem value="12" className="hover:bg-black hover:text-white font-semibold text-xs">12</SelectItem>
              <SelectItem value="13" className="hover:bg-black hover:text-white font-semibold text-xs">13</SelectItem>
              <SelectItem value="14" className="hover:bg-black hover:text-white font-semibold text-xs">14</SelectItem>
              <SelectItem value="15" className="hover:bg-black hover:text-white font-semibold text-xs">15</SelectItem>
            </SelectContent>
          </Select>

          {/* Sections Button */}
          <Button
            onClick={onSectionsClick}
            variant="outline"
            size="sm"
            className="gap-1 font-semibold text-xs uppercase border-2 border-black/20 hover:bg-black hover:text-white h-9 px-3 transition-all"
          >
            <Menu className="h-3.5 w-3.5" />
            Sections
          </Button>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Edit/Preview Toggle */}
          <div className="flex items-center p-1 rounded-sm bg-white border-2 border-black/20 h-9">
            <button
              onClick={toggleEditMode}
              className={`flex items-center rounded-sm gap-1 px-3 h-full text-xs font-semibold uppercase transition-all ${
                state?.resumeEditingMode
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={toggleEditMode}
              className={`flex items-center rounded-sm gap-1 px-3 h-full text-xs font-semibold uppercase transition-all ${
                !state?.resumeEditingMode
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>

          {/* Download Button */}
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={state?.resumeDownloading}
            className="gap-1 font-semibold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-500 h-9 px-3 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            {state?.resumeDownloading ? "Preparing..." : "Export"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;