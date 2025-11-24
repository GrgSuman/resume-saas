import React, { useState, useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Slider } from "../../../../components/ui/slider";
import {
  GripVertical,
  Download,
  FileText,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useResume } from "../../../../hooks/useResume";
import { cn } from "../../../../lib/utils";
import { ResumeSectionKey } from "../../types/constants";
import { TEMPLATES, FONT_FAMILIES } from "../../types/constants";
import type { Section } from "../../types/resume";
import axiosInstance from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import DownloadingUI from "./DownloadingUI";

// Draggable Section Item Component
interface DraggableSectionItemProps {
  section: Section;
  index: number;
  onToggle: (key: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableSectionItem = ({
  section,
  index,
  onToggle,
  onMove,
}: DraggableSectionItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "section",
    item: { index, section },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "section",
    hover: (draggedItem: { index: number; section: Section }) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all group border cursor-move",
        section.visible
          ? "bg-background hover:bg-accent/50 border-border"
          : "bg-muted/30 opacity-60 border-transparent",
        isDragging && "opacity-50",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <GripVertical
        className={cn(
          "h-3.5 w-3.5 cursor-grab transition-colors flex-shrink-0",
          section.visible
            ? "text-muted-foreground/60 group-hover:text-muted-foreground"
            : "text-muted-foreground/30"
        )}
      />
      <span
        className={cn(
          "text-sm flex-1 transition-colors",
          section.visible ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {section.label}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-background"
        onClick={() => onToggle(section.key)}
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? (
          <Eye className="h-3.5 w-3.5" />
        ) : (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

const Settings = ({
  htmlRef,
  isOpen,
  onClose,
}: {
  htmlRef: React.RefObject<HTMLDivElement | null>;
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const { state, dispatch } = useResume();
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isSettingsOpen = isOpen !== undefined ? isOpen : settingsOpen;
  const handleClose = onClose || (() => setSettingsOpen(false));

  // Use context state directly
  const resumeName = state.resumeTitle;
  const selectedTemplate = state.resumeSettings?.template || "classic";
  const fontFamily = state.resumeSettings?.fontFamily || "lato";
  const fontSize = parseInt(state.resumeSettings?.fontSize) ?? 14;
  const lineHeight = parseFloat(state.resumeSettings?.lineHeight ?? 1.4);
  const sections = state.resumeSettings?.sections;

  const navigate = useNavigate();

  // Callbacks for better performance
  const toggleSection = useCallback(
    (key: (typeof ResumeSectionKey)[keyof typeof ResumeSectionKey]) => {
      const updatedSections = sections.map((s) =>
        s.key === key ? { ...s, visible: !s.visible } : s
      );
      dispatch({
        type: "UPDATE_RESUME_SETTINGS",
        payload: { sections: updatedSections },
      });
    },
    [sections, dispatch]
  );

  const moveSection = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedSection = sections[dragIndex];
      const newSections = [...sections];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);

      // Update order property
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      dispatch({
        type: "UPDATE_RESUME_SETTINGS",
        payload: { sections: updatedSections },
      });
    },
    [sections, dispatch]
  );

  const handleNameSave = () => {
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    }
    if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { template: templateId },
    });
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { fontFamily: value },
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    const v = Math.round(value[0]);
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { fontSize: String(v) },
    });
  };

  const handleLineHeightChange = (value: number[]) => {
    const v = Number(value[0].toFixed(2));
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { lineHeight: String(v) },
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

  // Memoized section list
  const enabledSectionsCount = useMemo(
    () => sections.filter((s) => s.visible).length,
    [sections]
  );

  if (!isSettingsOpen) {
    return null;
  }

  return (
    <>
      {/* Full Page Loading Overlay */}
      {state.resumeDownloading && (
        <DownloadingUI />
      )}
      
      <DndProvider backend={HTML5Backend}>
        <div className="w-full xl:w-80 flex flex-col h-full border-r bg-background z-[60]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
          <div className="flex items-center gap-2 flex-1 min-w-0">

            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <Input
                  value={resumeName}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_RESUME_TITLE",
                      payload: e.target.value,
                    })
                  }
                  onBlur={handleNameSave}
                  onKeyDown={handleNameKeyDown}
                  className="h-7 text-sm font-medium"
                  autoFocus
                  placeholder="Resume name"
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-sm font-medium truncate hover:text-foreground/80 transition-colors px-2 py-1 rounded hover:bg-accent w-full text-left"
                  title="Click to edit name"
                >
                  {resumeName}
                </button>
              )}
            </div>
          </div>

          {/* Close button - hidden on mobile */}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 shrink-0 hover:bg-accent hidden xl:flex"
            onClick={handleClose}
            title="Close settings"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Template Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Template</Label>
                  <span className="text-xs text-muted-foreground capitalize">
                    {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={cn(
                        "relative w-full h-20 rounded-lg border transition-all bg-card hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20",
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                        <FileText
                          className={cn(
                            "h-5 w-5 transition-colors",
                            selectedTemplate === template.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="text-xs font-medium text-center leading-tight">
                          {template.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Typography</Label>
                <div className="p-3 bg-card rounded-lg border space-y-3">
                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Font Family
                    </Label>
                    <Select
                      value={fontFamily}
                      onValueChange={handleFontFamilyChange}
                    >
                      <SelectTrigger className="h-8 w-full text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                          <SelectItem
                            key={font.value}
                            value={font.value}
                            className="text-sm"
                          >
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Size and Line Height */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Font Size
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {fontSize}px
                        </span>
                      </div>
                      <Slider
                        value={[fontSize]}
                        min={10}
                        max={18}
                        step={1}
                        onValueChange={handleFontSizeChange}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Line Height
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {lineHeight.toFixed(2)}em
                        </span>
                      </div>
                      <Slider
                        value={[lineHeight]}
                        min={1.2}
                        max={1.8}
                        step={0.05}
                        onValueChange={handleLineHeightChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Sections</Label>
                  <span className="text-xs text-muted-foreground">
                    {enabledSectionsCount} of {sections.length} enabled
                  </span>
                </div>
                <div className="p-3 bg-card rounded-lg border space-y-2">
                  {sections.map((section, index) => (
                    <DraggableSectionItem
                      key={section.key}
                      section={section}
                      index={index}
                      onToggle={toggleSection}
                      onMove={moveSection}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Export Footer */}
        <div className="border-t bg-background p-3">
          <Button
            className="w-full h-9 bg-primary hover:bg-primary/90 gap-2 text-sm font-medium"
            onClick={handleExport}
            size="sm"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </DndProvider>
    </>
  );
};

export default Settings;
