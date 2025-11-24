import { useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";
import {
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { useResume } from "../../../../hooks/useResume";
import { cn } from "../../../../lib/utils";
import { ResumeSectionKey } from "../../types/constants";
import type { Section } from "../../types/resume";

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

interface ManageSectionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ManageSections = ({ open, onOpenChange }: ManageSectionsProps) => {
  const { state, dispatch } = useResume();
  
  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(
    () => state.resumeSettings?.sections || [],
    [state.resumeSettings?.sections]
  );

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

  // Memoized section list
  const enabledSectionsCount = useMemo(
    () => sections.filter((s) => s.visible).length,
    [sections]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Sections</DialogTitle>
          <DialogDescription>
            Drag and drop to reorder sections, or toggle visibility using the eye icon.
          </DialogDescription>
        </DialogHeader>

        <DndProvider backend={HTML5Backend}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Sections</Label>
              <span className="text-xs text-muted-foreground">
                {enabledSectionsCount} of {sections.length} enabled
              </span>
            </div>
            <ScrollArea className="h-[450px]">
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
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </DndProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSections;

