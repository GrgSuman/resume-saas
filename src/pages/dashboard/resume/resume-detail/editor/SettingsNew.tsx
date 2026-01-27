import { useState } from "react";
import { useNavigate } from "react-router";
import { flushSync } from "react-dom";
import { toast } from "react-toastify";
import {ZoomIn,Download,ArrowLeft,
  ZoomOut,
  Minus,
  Plus,
  ArrowDownUp,
  LayoutTemplate,
  Type,
  Edit3,
  Eye,
  AlignLeft,
  // AlignCenter,
  // AlignRight,
  AlignJustify,
} from "lucide-react";

// UI Components
import { Button } from "../../../../../components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "../../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";

// Local Components & Hooks
import ManageSections from "./ManageSections";
import { useResume } from "../../../../../hooks/useResume";
import { TEMPLATES, FONT_FAMILIES } from "../../../types/constants";
import axiosInstance from "../../../../../api/axios";
import { cn } from "../../../../../lib/utils";

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
}: SettingsNewProps) => {
  const { state, dispatch } = useResume();
  const navigate = useNavigate();
  const editMode = state.resumeEditingMode ?? false;

  const [isManageSectionsOpen, setIsManageSectionsOpen] = useState(false);
  const [isAlignmentDropdownOpen, setIsAlignmentDropdownOpen] = useState(false);

  // Resume Settings Data
  const selectedTemplate = state.resumeSettings?.template || "professional";
  const fontFamily = state.resumeSettings?.fontFamily || "Lato";
  const lineHeight = parseFloat(state.resumeSettings?.lineHeight ?? "1.4");
  const fontSize = parseInt(state.resumeSettings?.fontSize ?? "14", 10);
  const textAlignment = state.resumeSettings?.textAlignment || "left";
  const resumeName = state.resumeTitle || "Resume";

  // --- Handlers ---
  const handleTemplateChange = (value: string) => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { template: value } });
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { fontFamily: value } });
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

  const handleFontSizeChange = (value: string) => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { fontSize: value } });
  };

  const handleTextAlignmentChange = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { textAlignment: alignment } });
  };

  const handleExport = async () => {
    const previousEditMode = state.resumeEditingMode ?? false;
    flushSync(() => {
      dispatch({ type: "SET_EDITING_MODE", payload: false });
    });
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    if (htmlRef.current) {
      const htmlContent = htmlRef.current.innerHTML;
      try {
        dispatch({ type: "SET_DOWNLOADING", payload: true });
        const response = await axiosInstance.post(
          "/generate-pdf",
          { htmlContent, marginStatus: true, resumeName: resumeName },
          { responseType: "blob" }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${resumeName}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
        toast.error("Failed to download PDF");
      } finally {
        flushSync(() => {
          dispatch({ type: "SET_EDITING_MODE", payload: previousEditMode });
        });
        dispatch({ type: "SET_DOWNLOADING", payload: false });
      }
    }
  };

  const toggleEditMode = () => {
    dispatch({ type: "SET_EDITING_MODE", payload: !editMode });
  };

  const VerticalSeparator = ({ className }: { className?: string }) => (
    <div className={cn("h-5 w-[1px] bg-border/60 mx-1 md:mx-2", className)} />
  );

  return (
    <div className="w-full bg-background/95 backdrop-blur-md rounded-xl border border-border/60 sticky top-2 z-50">
      <div className="flex items-center justify-between px-3 py-2 gap-2 overflow-x-auto scrollbar-hide">
        {/* Left: Design Tools */}
        <div className="flex items-center gap-1 min-w-max">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => state.isTailoredResume ? navigate("/dashboard/jobs") : navigate("/dashboard/resume")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <VerticalSeparator />

          {/* Template Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs font-medium hover:bg-muted/50 md:px-2.5"
              >
                <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden md:inline">Template</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {TEMPLATES.map((t: { id: string; name: string; }) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={cn(
                    "cursor-pointer",
                    selectedTemplate === t.id && "bg-accent"
                  )}
                >
                  {t.name}
                  {selectedTemplate === t.id && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <VerticalSeparator />

          {/* Typography Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs font-medium hover:bg-muted/50 md:px-2.5"
              >
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden md:inline">Typography</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-3">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Font Family</label>
                  <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                    <SelectTrigger className="h-8 w-full border-input bg-background text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((f: { value: string; label: string; }) => (
                        <SelectItem key={f.value} value={f.value} className="text-sm">
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Font Size</label>
                  <Select value={String(fontSize)} onValueChange={handleFontSizeChange}>
                    <SelectTrigger className="h-8 w-full border-input bg-background text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 9 }, (_, idx) => 10 + idx).map((size) => (
                        <SelectItem key={size} value={String(size)} className="text-sm">
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <VerticalSeparator />

          {/* Alignment Dropdown */}
          <DropdownMenu open={isAlignmentDropdownOpen} onOpenChange={setIsAlignmentDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs font-medium hover:bg-muted/50 md:px-2.5"
              >
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden md:inline">Alignment</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-3 shadow-sm">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Text Alignment</label>
                  <div className="flex items-center gap-1.5">
                    <Button 
                      variant={textAlignment === "left" ? "default" : "outline"} 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleTextAlignmentChange("left"); }} 
                      className="h-8 w-8"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={textAlignment === "justify" ? "default" : "outline"} 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleTextAlignmentChange("justify"); }} 
                      className="h-8 w-8"
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Line Height</label>
                  <div className="w-full flex items-center h-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleLineHeightDecrease(); }}
                      className="h-full w-8 hover:bg-background rounded-l-md rounded-r-none border border-border/40"
                      disabled={lineHeight <= 1.0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-10 text-center text-xs font-semibold tabular-nums text-foreground">{lineHeight.toFixed(1)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleLineHeightIncrease(); }}
                      className="h-full w-8 hover:bg-background rounded-r-md rounded-l-none border border-border/40"
                      disabled={lineHeight >= 2.0}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <VerticalSeparator />

          {/* Sections Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsManageSectionsOpen(true)}
            className="h-8 gap-1.5 px-2 text-xs font-medium  hover:text-foreground md:px-2.5"
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sections</span>
          </Button>
        </div>

        {/* Right: View & Actions */}
        <div className="flex items-center gap-2 min-w-max">
          {/* Zoom Controls - Hidden on Mobile */}
          <div className="hidden md:flex items-center bg-muted/30 rounded-md border border-border/40 h-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomOut}
              className="h-full w-8 hover:bg-background rounded-l-md border-r border-border/40"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <div className="w-11 text-center text-xs font-semibold tabular-nums">{Math.round(zoomLevel * 100)}%</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomIn}
              className="h-full w-8 hover:bg-background rounded-r-md border-l border-border/40"
              disabled={zoomLevel >= 1.0}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>

          <VerticalSeparator className="hidden md:block" />

          {/* View/Edit Toggle */}
          <div
            className="flex items-center bg-muted/40 p-1 rounded-lg border border-border/40 cursor-pointer hover:bg-muted/60 h-8"
            onClick={toggleEditMode}
            role="button"
            tabIndex={0}
          >
            <div className={cn(
              "flex items-center gap-1.5 px-2 md:px-3 h-full rounded-md transition-all duration-200 text-xs font-medium",
              !editMode ? "bg-background text-foreground border border-border/20 shadow-sm" : "text-muted-foreground"
            )}>
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden md:inline">View</span>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 px-2 md:px-3 h-full rounded-md transition-all duration-200 text-xs font-medium",
              editMode ? "bg-background text-foreground border border-border/20 shadow-sm" : "text-muted-foreground"
            )}>
              <Edit3 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Edit</span>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleExport}
            size="sm"
            variant="default"
            className="h-8 gap-1.5 px-2 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Download</span>
          </Button>
        </div>
      </div>

      <ManageSections
        open={isManageSectionsOpen}
        onOpenChange={setIsManageSectionsOpen}
      />
    </div>
  );
};

export default SettingsNew;