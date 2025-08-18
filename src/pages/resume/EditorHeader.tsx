import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import {
  ArrowLeft,
  Download,
  Eye,
  SquarePen,
  Menu,
  X,
  LayoutGrid,
  Settings,
  Palette,
} from "lucide-react";
import { useResume } from "../../hooks/useResume";
import { useNavigate } from "react-router";
import axios from "axios";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import TemplateSelector from "./components/TemplateSelector";
import { toast } from "react-toastify";
import { FONT_OPTIONS, TEMPLATES } from "../../lib/constants";

interface EditorHeaderProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
  onSectionsClick: () => void;
}

const EditorHeader = ({ resumeRef, onSectionsClick }: EditorHeaderProps) => {
  const { state, dispatch } = useResume();
  const navigate = useNavigate();
  const [shouldDownload, setShouldDownload] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const { deductCredits } = useAuth();

  useEffect(() => {
    const downloadPDF = async (htmlContent: string) => {
      try {
        dispatch({ type: "SET_DOWNLOADING", payload: true });
        const response = await axiosInstance.post(
          "/generate-pdf",
          {
            htmlContent,
            marginStatus:
              state.resumeSettings?.template === TEMPLATES.EXECUTIVE
                ? false
                : true,
          },
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        a.click();
        deductCredits("DOWNLOAD_PDF");
        window.URL.revokeObjectURL(url);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          try {
            const text = await error?.response?.data?.text();
            const errorData = JSON.parse(text);
            if (errorData.message === "Insufficient credits") {
              toast.info("Insufficient credits, Click to Buy credits", {
                onClick: () => {
                  navigate("/dashboard/credits");
                },
              });
            } else {
              toast.error(errorData.message || "Failed to download PDF");
            }
          } catch (parseError) {
            console.log(parseError);
            toast.error("Failed to download PDF");
          }
        } else {
          toast.error("Failed to download PDF");
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
  }, [
    state?.resumeEditingMode,
    shouldDownload,
    resumeRef,
    dispatch,
    deductCredits,
    navigate,
    state.resumeSettings?.template,
  ]);

  const handleDownloadPDF = () => {
    dispatch({ type: "SET_EDITING_MODE", payload: false });
    setShouldDownload(true);
    setIsMobileMenuOpen(false);
  };

  const toggleEditMode = () => {
    dispatch({ type: "SET_EDITING_MODE", payload: !state?.resumeEditingMode });
    setIsMobileMenuOpen(false);
  };

  const handleSectionsClick = () => {
    onSectionsClick();
    setIsMobileMenuOpen(false);
  };

  const handleSettingChange = (key: string, value: number | string) => {
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { [key]: value },
    });
  };

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900 border-gray-700 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden h-16 items-center justify-between px-6 lg:flex">
        {/* Left - Document Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="h-6 w-px bg-gray-700" />

          {/* Main Controls */}
          <div className="flex items-center gap-3 relative">
            {/* Template Selector Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateSelectorOpen(true)}
              className="gap-2 text-sm font-medium border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200"
            >
              <div className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-gray-900 group-hover:bg-gray-800 transition-colors">
                Template
              </div>
              <Palette className="h-4 w-4" />
              {state.resumeSettings?.template || "Professional"}
            </Button>

            {/* Font Selector */}
            <div className="relative">
              <Select
                value={state.resumeSettings?.fontFamily || "Roboto"}
                onValueChange={(value) =>
                  handleSettingChange("fontFamily", value)
                }
              >
                <SelectTrigger
                  size="sm"
                  className="h-9 w-36 border-gray-700 bg-gray-800 text-sm font-medium text-gray-200 hover:bg-gray-700 group"
                >
                  <div className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-gray-900 group-hover:bg-gray-800 transition-colors">
                    Font
                  </div>
                  <SelectValue placeholder="Roboto" />
                </SelectTrigger>

                <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem
                      key={font.id}
                      value={font.name}
                      className="text-sm hover:bg-gray-700"
                    >
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAdvancedSettings}
            className={`gap-2 text-sm font-medium border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200 ${
              showAdvancedSettings ? "bg-gray-700" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            {showAdvancedSettings ? "Hide Settings" : "More Settings"}
          </Button>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Edit/Preview Toggle */}
          <Button
            onClick={toggleEditMode}
            variant="outline"
            size="sm"
            className="gap-2 text-sm font-medium border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200"
          >
            {state?.resumeEditingMode ? (
              <>
                <Eye className="h-4 w-4" />
                Preview Resume
              </>
            ) : (
              <>
                <SquarePen className="h-4 w-4" />
                Edit Resume Manually
              </>
            )}
          </Button>

          {/* Sections Button */}
          <Button
            onClick={handleSectionsClick}
            variant="outline"
            size="sm"
            className="gap-2 text-sm font-medium border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200"
          >
            <LayoutGrid className="h-4 w-4" />
            Sections
          </Button>

          {/* Download Button */}
          <Button
            onClick={handleDownloadPDF}
            disabled={state?.resumeDownloading}
            size="sm"
            className="gap-2 bg-[#7060fc] text-sm font-medium text-white hover:bg-[#5a4fd8]"
          >
            <Download className="h-4 w-4" />
            {state?.resumeDownloading ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Advanced Settings Panel (Desktop) */}
      {showAdvancedSettings && (
        <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center gap-4">
            {/* Font Size */}
            <div className="flex items-center gap-2 w-48">
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Font Size
              </span>
              <Slider
                value={[state.resumeSettings?.fontSize || 14]}
                onValueChange={(value) =>
                  handleSettingChange("fontSize", value[0])
                }
                min={10}
                max={16}
                step={1}
                className="w-full"
              />
              <span className="text-sm font-medium text-gray-300 w-6">
                {state.resumeSettings?.fontSize || 14}px
              </span>
            </div>

            {/* Line Height */}
            <div className="flex items-center gap-2 w-48">
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                Line Height
              </span>
              <Slider
                value={[((state.resumeSettings?.lineHeight || 1.2) - 1) * 100]}
                onValueChange={(value) =>
                  handleSettingChange("lineHeight", 1 + value[0] / 100)
                }
                min={0}
                max={60}
                step={10}
                className="w-full"
              />
              <span className="text-sm font-medium text-gray-300 w-8">
                {((state.resumeSettings?.lineHeight || 1.2) * 10).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="gap-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-gray-200 font-medium">Resume Editor</h2>

        <div className="flex items-center gap-2">
          {/* Edit/Preview Toggle */}
          <Button
            onClick={toggleEditMode}
            variant="outline"
            size="sm"
            className="gap-2 text-sm font-medium border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200"
          >
            {state?.resumeEditingMode ? (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <SquarePen className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>

          <Button
            onClick={handleDownloadPDF}
            disabled={state?.resumeDownloading}
            size="sm"
            className="bg-[#7060fc] text-white hover:bg-[#5a4fd8]"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="outline"
            size="sm"
            className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-gray-800 border-gray-700 p-4 shadow-lg lg:hidden">
          <div className="space-y-4">
            {/* Sections Button */}
            <Button
              onClick={handleSectionsClick}
              variant="outline"
              className="w-full text-sm font-medium border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-gray-200"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Manage Sections
            </Button>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Design Settings
              </h3>

              {/* Template Selector */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Template
                </label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTemplateSelectorOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-sm font-medium border-gray-700 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-gray-200"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  {state.resumeSettings?.template || "Professional"}
                </Button>
              </div>

              {/* Font Selector */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Font
                </label>
                <Select
                  value={state.resumeSettings?.fontFamily || "Roboto"}
                  onValueChange={(value) => {
                    handleSettingChange("fontFamily", value);
                  }}
                >
                  <SelectTrigger className="w-full border-gray-700 bg-gray-700 text-gray-200">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem
                        key={font.id}
                        value={font.name}
                        className="text-sm hover:bg-gray-700"
                      >
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Font Size: {state.resumeSettings?.fontSize || 14}px
                </label>
                <Slider
                  value={[state.resumeSettings?.fontSize || 14]}
                  onValueChange={(value) =>
                    handleSettingChange("fontSize", value[0])
                  }
                  min={10}
                  max={16}
                  step={1}
                  className="bg-gray-700"
                />
              </div>

              {/* Line Height */}
              <div className="mb-2">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Spacing:{" "}
                  {((state.resumeSettings?.lineHeight || 1.2) * 10).toFixed(1)}
                </label>
                <Slider
                  value={[
                    ((state.resumeSettings?.lineHeight || 1.2) - 1) * 100,
                  ]}
                  onValueChange={(value) =>
                    handleSettingChange("lineHeight", 1 + value[0] / 100)
                  }
                  min={0}
                  max={60}
                  step={10}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
      />
    </header>
  );
};

export default EditorHeader;
