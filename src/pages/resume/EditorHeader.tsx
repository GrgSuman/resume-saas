import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ArrowLeft, Download, Eye, Edit3, Menu, X, LayoutGrid } from "lucide-react";
import { useResume } from "../../hooks/useResume";
import { useNavigate } from "react-router";
import axios from "axios";
import axiosInstance from "../../api/axios";
import { toast } from "sonner";

interface EditorHeaderProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
  onSectionsClick: () => void;
}

const EditorHeader = ({ resumeRef, onSectionsClick }: EditorHeaderProps) => {
  const { state, dispatch } = useResume();
  const navigate = useNavigate();
  const [shouldDownload, setShouldDownload] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const downloadPDF = async (htmlContent: string) => {
      try {
        dispatch({ type: "SET_DOWNLOADING", payload: true });
        const response = await axiosInstance.post('/generate-pdf',{ htmlContent });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf';
        a.click();
        // Cleanup
        window.URL.revokeObjectURL(url);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Failed to download PDF',{
            position: "top-right",
          });
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setShouldDownload(false);
        dispatch({ type: "SET_DOWNLOADING", payload: false });
      }
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
    setIsMobileMenuOpen(false); // Close menu when downloading
  };

  const toggleEditMode = () => {
    dispatch({ type: "SET_EDITING_MODE", payload: !state?.resumeEditingMode });
    setIsMobileMenuOpen(false); // Close menu when toggling edit mode
  };

  const handleSectionsClick = () => {
    onSectionsClick();
    setIsMobileMenuOpen(false); // Close menu when clicking sections
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-white">
      {/* Mobile Top Bar */}
      <div className="flex h-14 items-center justify-between px-4 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="gap-2 text-xs uppercase h-9 px-3 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="sr-only">Back</span>
        </Button>

        {/* Center - Edit/Preview Toggle */}
        <div className="flex items-center p-[1px] rounded-sm bg-white border-2 border-black/20 h-9">
          <button
            onClick={toggleEditMode}
            className={`flex items-center rounded-sm gap-1 px-3 h-full text-xs font-semibold uppercase transition-all ${
              state?.resumeEditingMode ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={toggleEditMode}
            className={`flex items-center rounded-sm gap-1 px-3 h-full text-xs font-semibold uppercase transition-all ${
              !state?.resumeEditingMode ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Button */}
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={state?.resumeDownloading}
            className="gap-1 font-semibold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-500 h-9 px-3 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>

          {/* Manage Sections Button */}
          <Button
            size="sm"
            onClick={handleSectionsClick}
            className="border-2 border-black/20 h-9 px-3 bg-white text-black hover:bg-black hover:text-white transition-all"
            variant="outline"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="sr-only">Manage Sections</span>
          </Button>

          {/* Menu Button */}
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="outline"
            size="sm"
            className="gap-1 font-semibold text-xs uppercase border-2 border-black/20 hover:bg-black hover:text-white h-9 px-3 transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Menu className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden h-14 items-center justify-between px-4 lg:flex">
        {/* Left - Back Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2 font-semibold text-xs uppercase h-9 px-3 transition-all"
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
            <SelectContent className="border-2 border-black/20 bg-white">
              <SelectItem value="Creative" className="hover:bg-black hover:text-white font-semibold text-xs">
                Creative
              </SelectItem>
              <SelectItem value="Professional" className="hover:bg-black hover:text-white font-semibold text-xs">
                Professional
              </SelectItem>
              <SelectItem value="Two Column" className="hover:bg-black hover:text-white font-semibold text-xs">
                Two Column
              </SelectItem>
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
            <SelectContent className="border-2 border-black/20 bg-white">
              <SelectItem value="Roboto" className="hover:bg-black hover:text-white font-semibold text-xs">
                Sans
              </SelectItem>
              <SelectItem value="PT Serif" className="hover:bg-black hover:text-white font-semibold text-xs">
                Serif
              </SelectItem>
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
          <SelectTrigger className="h-9 border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black/20 bg-white">
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
          <div className="flex items-center p-[1px] rounded-sm bg-white border-2 border-black/20 h-9">
            <button
              onClick={toggleEditMode}
              className={`flex items-center rounded-sm gap-1 px-3 h-full text-xs font-semibold uppercase transition-all ${
                state?.resumeEditingMode ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={toggleEditMode}
              className={`flex items-center rounded-sm gap-1 px-3 h-full text-xs font-semibold uppercase transition-all ${
                !state?.resumeEditingMode ? "bg-black text-white" : "hover:bg-gray-100"
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Mobile Menu Content - Horizontal Bar */}
          <div className="fixed inset-x-0 top-14 z-50 lg:hidden bg-white border-b-2 border-black/20 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Settings Controls */}
              <div className="flex items-center gap-3 w-full">
                {/* Template Selector */}
                <Select
                  value={state.resumeSettings?.template || "Creative"}
                  onValueChange={(value) => {
                    dispatch({
                      type: "UPDATE_RESUME_SETTINGS",
                      payload: { template: value },
                    });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black/20 bg-white">
                    <SelectItem value="Creative" className="hover:bg-black hover:text-white font-semibold text-xs">Creative</SelectItem>
                    <SelectItem value="Professional" className="hover:bg-black hover:text-white font-semibold text-xs">Professional</SelectItem>
                    <SelectItem value="Two Column" className="hover:bg-black hover:text-white font-semibold text-xs">Two Column</SelectItem>
                  </SelectContent>
                </Select>

                {/* Font Selector */}
                <Select
                  value={state.resumeSettings?.fontFamily || "Roboto"}
                  onValueChange={(value) => {
                    dispatch({
                      type: "UPDATE_RESUME_SETTINGS",
                      payload: { fontFamily: value },
                    });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black/20 bg-white">
                    <SelectItem value="Roboto" className="hover:bg-black hover:text-white font-semibold text-xs">Sans</SelectItem>
                    <SelectItem value="PT Serif" className="hover:bg-black hover:text-white font-semibold text-xs">Serif</SelectItem>
                  </SelectContent>
                </Select>

                {/* Size Selector */}
                <Select
                  value={state.resumeSettings?.fontSize?.toString() || "14"}
                  onValueChange={(value) => {
                    dispatch({
                      type: "UPDATE_RESUME_SETTINGS",
                      payload: { fontSize: parseInt(value) },
                    });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-2 border-black/20 bg-white hover:bg-gray-100 font-semibold text-xs">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black/20 bg-white">
                    <SelectItem value="12" className="hover:bg-black hover:text-white font-semibold text-xs">12</SelectItem>
                    <SelectItem value="13" className="hover:bg-black hover:text-white font-semibold text-xs">13</SelectItem>
                    <SelectItem value="14" className="hover:bg-black hover:text-white font-semibold text-xs">14</SelectItem>
                    <SelectItem value="15" className="hover:bg-black hover:text-white font-semibold text-xs">15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default EditorHeader;