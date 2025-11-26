import { useState } from "react";
import { useNavigate } from "react-router";
import { flushSync } from "react-dom";
import { toast } from "react-toastify";
import {ZoomIn,ZoomOut,RotateCcw,Minus,Plus,ArrowLeft,Download,ArrowDownUp,LayoutTemplate,Type,
  Monitor,
  Settings2,
  Edit3,
  Eye
} from "lucide-react";

// UI Components
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";

// Local Components & Hooks
import ManageSections from "./ManageSections";
import { useResume } from "../../../../hooks/useResume";
import { TEMPLATES, FONT_FAMILIES } from "../../types/constants";
import axiosInstance from "../../../../api/axios";
import { cn } from "../../../../lib/utils"; // Assuming you have a cn utility, if not remove wrapping cn()

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

  // Mobile Sheet State
  const [isManageSectionsOpen, setIsManageSectionsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  // Resume Settings Data
  const selectedTemplate = state.resumeSettings?.template || "professional";
  const fontFamily = state.resumeSettings?.fontFamily || "Lato";
  const lineHeight = parseFloat(state.resumeSettings?.lineHeight ?? "1.4");
  const fontSize = parseInt(state.resumeSettings?.fontSize ?? "14", 10);
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
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { lineHeight: String(newLineHeight) } });
  };
  const handleLineHeightDecrease = () => {
    const newLineHeight = Math.max(Number((lineHeight - 0.1).toFixed(2)), 1.0);
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { lineHeight: String(newLineHeight) } });
  };
  const handleFontSizeChange = (value: string) => {
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { fontSize: value } });
  };

  const handleExport = async () => {
    const previousEditMode = state.resumeEditingMode ?? false;
    flushSync(() => { dispatch({ type: "SET_EDITING_MODE", payload: false }); });
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
        flushSync(() => { dispatch({ type: "SET_EDITING_MODE", payload: previousEditMode }); });
        dispatch({ type: "SET_DOWNLOADING", payload: false });
      }
    }
  };

  const toggleEditMode = () => {
      dispatch({ type: "SET_EDITING_MODE", payload: !editMode });
  }

  // --- UI Components ---

  const VerticalSeparator = () => (
    <div className="h-6 w-[1px] bg-border/60 mx-1 hidden md:block" />
  );

  const TemplateSelector = ({ mobile = false }) => (
    <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
      <SelectTrigger className={cn("h-8 border-muted-foreground/20 bg-transparent font-medium", mobile ? "w-full" : "w-[120px] border-0 hover:bg-muted/50 focus:ring-0")}>
        <div className="flex items-center gap-2">
           {!mobile && <LayoutTemplate className="h-4 w-4 text-muted-foreground" />}
           <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {TEMPLATES.map((t) => (<SelectItem key={t.id} value={t.id} className="font-medium">{t.name}</SelectItem>))}
      </SelectContent>
    </Select>
  );

  const FontSelector = ({ mobile = false }) => (
    <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
      <SelectTrigger className={cn("h-8 border-muted-foreground/20 bg-transparent font-medium", mobile ? "w-full" : "w-[120px] border-0 hover:bg-muted/50 focus:ring-0")}>
         <div className="flex items-center gap-2">
           {!mobile && <Type className="h-4 w-4 text-muted-foreground" />}
           <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {FONT_FAMILIES.map((f) => (<SelectItem key={f.value} value={f.value} className="font-medium">{f.label}</SelectItem>))}
      </SelectContent>
    </Select>
  );

  const LineHeightControls = () => (
    <div className="flex items-center bg-muted/30 rounded-md border border-border/40 h-8">
        <Button variant="ghost" size="icon" onClick={handleLineHeightDecrease} className="h-7 w-7 hover:bg-background rounded-l-md" disabled={lineHeight <= 1.0}>
            <Minus className="h-3.5 w-3.5" />
        </Button>
        <div className="w-9 text-center text-xs font-semibold tabular-nums text-foreground">
            {lineHeight.toFixed(1)}
        </div>
        <Button variant="ghost" size="icon" onClick={handleLineHeightIncrease} className="h-7 w-7 hover:bg-background rounded-r-md" disabled={lineHeight >= 2.0}>
            <Plus className="h-3.5 w-3.5" />
        </Button>
    </div>
  );

  const FontSizeSelector = ({ mobile = false }) => (
    <Select value={String(fontSize)} onValueChange={handleFontSizeChange}>
      <SelectTrigger className={cn("h-8 border-muted-foreground/20 bg-transparent font-medium", mobile ? "w-full" : "w-[92px] border-0 hover:bg-muted/50 focus:ring-0")}>
        <div className="flex items-center gap-1.5">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 9 }, (_, idx) => 10 + idx).map((size) => (
          <SelectItem key={size} value={String(size)} className="font-medium">
            {size}px
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const ZoomControls = () => (
      <div className="flex items-center bg-muted/30 rounded-md border border-border/40 h-8 p-0.5">
        <Button variant="ghost" size="icon" onClick={onZoomOut} className="h-7 w-7 hover:bg-background rounded-sm" disabled={zoomLevel <= 0.5}>
            <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <div className="w-10 text-center text-xs font-semibold tabular-nums text-foreground">
            {Math.round(zoomLevel * 100)}%
        </div>
        <Button variant="ghost" size="icon" onClick={onZoomIn} className="h-7 w-7 hover:bg-background rounded-sm" disabled={zoomLevel >= 1.0}>
            <ZoomIn className="h-3.5 w-3.5" />
        </Button>
      </div>
  );

  // --- Render ---

  return (
    <div className="w-full bg-background/95 backdrop-blur-md rounded-xl border border-border/60 sticky top-2 z-50">
      
      {/* -------------------- */}
      {/* DESKTOP TOOLBAR      */}
      {/* -------------------- */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between px-4 py-2 gap-3 min-w-max">
          
          {/* Left: Design Tools */}
          <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 text-muted-foreground hover:text-foreground mr-1">
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <VerticalSeparator />

              <div className="flex items-center gap-1">
                  <TemplateSelector />
                  <FontSelector />
                  <FontSizeSelector />
                  <LineHeightControls />
              </div>

              <VerticalSeparator />
              
               <Button variant="ghost" size="sm" onClick={() => setIsManageSectionsOpen(true)} className="h-8 gap-2 text-muted-foreground font-medium hover:text-foreground px-3">
                  <ArrowDownUp className="h-4 w-4" /> 
                  <span className="hidden lg:inline">Sections</span>
              </Button>
          </div>

          {/* Right: View & Actions */}
          <div className="flex items-center gap-2">
               <ZoomControls />
               
               <VerticalSeparator />

               <div 
                  className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/70 transition-colors group"
                  onClick={toggleEditMode}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleEditMode();
                      }
                  }}
                  title={editMode ? "Switch to View mode" : "Switch to Edit mode"}
               >
                  <div
                      className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-200 text-xs font-medium pointer-events-none",
                          !editMode 
                              ? "bg-background shadow-sm text-foreground" 
                              : "text-muted-foreground"
                      )}
                  >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="hidden lg:inline">View</span>
                  </div>
                  <div
                      className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-200 text-xs font-medium pointer-events-none",
                          editMode 
                              ? "bg-background shadow-sm text-foreground" 
                              : "text-muted-foreground"
                      )}
                  >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span className="hidden lg:inline">Edit</span>
                  </div>
               </div>

               <Button onClick={handleExport} size="sm" className="h-8 gap-2 px-3.5 shadow-sm font-semibold">
                  <Download className="h-4 w-4" /> 
                  <span className="hidden lg:inline">Download</span>
              </Button>
          </div>
        </div>
      </div>

      {/* -------------------- */}
      {/* MOBILE NAVBAR        */}
      {/* -------------------- */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
         <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 border-muted-foreground/20">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {/* Mobile Settings Sheet */}
            <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-muted-foreground/20 font-semibold text-muted-foreground">
                        <Settings2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Design</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8 pt-6">
                    <SheetHeader className="mb-6 text-left">
                        <SheetTitle className="text-xl font-bold">Resume Appearance</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-6">
                        {/* Section 1: Template */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                <LayoutTemplate className="h-4 w-4" /> Template
                            </label>
                            <TemplateSelector mobile />
                        </div>

                        {/* Section 2: Typography Grid */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-3">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <Type className="h-4 w-4" /> Font
                                </label>
                                <FontSelector mobile />
                             </div>
                             <div className="space-y-3">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    Font Size
                                </label>
                                <FontSizeSelector mobile />
                             </div>
                             <div className="space-y-3">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    Spacing
                                </label>
                                <LineHeightControls />
                             </div>
                        </div>

                         {/* Section 3: View & Zoom */}
                         <div className="space-y-3">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <Monitor className="h-4 w-4" /> View Scale
                                </label>
                                <div className="flex items-center justify-between">
                                    <ZoomControls />
                                    <Button variant="outline" size="icon" onClick={onResetZoom} className="h-9 w-9" title="Reset Zoom">
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <Button variant="outline" size="icon" onClick={() => setIsManageSectionsOpen(true)} className="h-9 w-9 border-muted-foreground/20">
               <ArrowDownUp className="h-4 w-4" />
            </Button>
         </div>

         {/* Mobile Right Actions */}
         <div className="flex items-center gap-3">
             {/* Toggle Edit/View */}
             <div 
                className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={toggleEditMode}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleEditMode();
                    }
                }}
                title={editMode ? "Switch to View mode" : "Switch to Edit mode"}
             >
                 <div
                     className={cn(
                         "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-200 text-xs font-medium pointer-events-none",
                         !editMode 
                             ? "bg-background shadow-sm text-foreground" 
                             : "text-muted-foreground"
                     )}
                 >
                     <Eye className="h-3.5 w-3.5" />
                     <span className="hidden sm:inline">View</span>
                 </div>
                 <div
                     className={cn(
                         "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-200 text-xs font-medium pointer-events-none",
                         editMode 
                             ? "bg-background shadow-sm text-foreground" 
                             : "text-muted-foreground"
                     )}
                 >
                     <Edit3 className="h-3.5 w-3.5" />
                     <span className="hidden sm:inline">Edit</span>
                 </div>
             </div>

            <Button onClick={handleExport} size="icon" className="h-9 w-9 shadow-sm">
                <Download className="h-4 w-4" />
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