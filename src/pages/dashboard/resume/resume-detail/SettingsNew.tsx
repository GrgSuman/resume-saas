import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Download,
  ArrowDownUp,
} from "lucide-react";
import ManageSections from "./ManageSections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useResume } from "../../../../hooks/useResume";
import { TEMPLATES, FONT_FAMILIES } from "../../types/constants";
import { flushSync } from "react-dom";
import axiosInstance from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";

interface SettingsNewProps {
  htmlRef: React.RefObject<HTMLDivElement | null>;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const SettingsNew = ({
  htmlRef,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: SettingsNewProps) => {
  const { state, dispatch } = useResume();
  const navigate = useNavigate();
  const editMode = state.resumeEditingMode ?? false;
  const [isManageSectionsOpen, setIsManageSectionsOpen] = useState(false);

  // Font, Template, and Line Height handlers
  const selectedTemplate = state.resumeSettings?.template || "professional";
  const fontFamily = state.resumeSettings?.fontFamily || "Lato";
  const lineHeight = parseFloat(state.resumeSettings?.lineHeight ?? "1.4");
  const resumeName = state.resumeTitle || "Resume";

  const handleTemplateChange = (value: string) => {
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { template: value },
    });
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { fontFamily: value },
    });
  };

  const handleLineHeightIncrease = () => {
    const newLineHeight = Math.min(Number((lineHeight + 0.1).toFixed(2)), 2.0);
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { lineHeight: String(newLineHeight) },
    });
  };

  const handleLineHeightDecrease = () => {
    const newLineHeight = Math.max(Number((lineHeight - 0.1).toFixed(2)), 1.0);
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { lineHeight: String(newLineHeight) },
    });
  };

  const handleExport = async () => {
    const previousEditMode = state.resumeEditingMode ?? false;

    // Force turn off edit mode and flush DOM updates before reading HTML
    flushSync(() => {
      dispatch({ type: "SET_EDITING_MODE", payload: false });
    });
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    // Export logic here
    if (htmlRef.current) {
      const htmlContent = htmlRef.current.innerHTML;
      try {
        dispatch({ type: "SET_DOWNLOADING", payload: true });
        const response = await axiosInstance.post(
          "/generate-pdf",
          {
            htmlContent,
            marginStatus: true,
            resumeName: resumeName,
          },
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${resumeName}.pdf`;
        a.click();
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
        // Restore previous edit mode state after export attempt
        flushSync(() => {
          dispatch({ type: "SET_EDITING_MODE", payload: previousEditMode });
        });
        dispatch({ type: "SET_DOWNLOADING", payload: false });
      }
    }
  };

  const handleResetZoom = () => {
    onResetZoom();
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
      {/* Scrollable indicator gradient - shows on small screens */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent pointer-events-none z-10 sm:hidden" />
      <div className="flex items-center justify-between gap-4 px-3 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
        {/* Left side: Groups 1, 2, 3 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Group 1: Navigation & Structure */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="h-5 w-px bg-border" />

            {/* Template Selection */}
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger
                size="sm"
                className="h-8 text-sm border-0 shadow-none bg-transparent hover:bg-accent"
              >
                <SelectValue className="text-sm font-medium text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id} className="text-sm">
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group 2: Styling & Content */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Font Selection */}
            <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
              <SelectTrigger
                size="sm"
                className="h-8 text-sm border-0 shadow-none bg-transparent hover:bg-accent min-w-[110px]"
              >
                <SelectValue className="text-sm font-medium text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value} className="text-sm">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-5 w-px bg-border" />

            {/* Line Height Controls */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLineHeightDecrease}
                disabled={lineHeight <= 1.0}
                className="h-8 w-8"
                title="Decrease Line Height"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium min-w-[45px] sm:min-w-[50px] text-center text-muted-foreground">
                {lineHeight.toFixed(1)}em
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLineHeightIncrease}
                disabled={lineHeight >= 2.0}
                className="h-8 w-8"
                title="Increase Line Height"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-5 w-px bg-border" />

            {/* Manage Sections Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsManageSectionsOpen(true)}
              title="Manage Sections"
            >
              <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-normal  hidden sm:inline">Manage Sections</span>
            </Button>
          </div>

          {/* Group 3: View Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                disabled={zoomLevel <= 0.5}
                className="h-8 w-8"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium min-w-[45px] sm:min-w-[50px] text-center text-muted-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                disabled={zoomLevel >= 1.0}
                className="h-8 w-8"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="h-5 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetZoom}
                className="h-8 w-8"
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-5 w-px bg-border" />

            {/* Edit Mode Toggle */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => dispatch({ type: "SET_EDITING_MODE", payload: !editMode })}
            >
              <Switch
                checked={editMode}
                onCheckedChange={() =>
                  dispatch({ type: "SET_EDITING_MODE", payload: !editMode })
                }
                className="scale-90"
              />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors hidden sm:inline">
                {editMode ? "Editing" : "Viewing"}
              </span>
            </div>
          </div>
        </div>

        {/* Group 4: Primary Action (Far Right) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Download Button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="h-8 gap-1.5 px-2 sm:px-3 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
      
      {/* Manage Sections Dialog */}
      <ManageSections
        open={isManageSectionsOpen}
        onOpenChange={setIsManageSectionsOpen}
      />
    </div>
  );
};

export default SettingsNew;

