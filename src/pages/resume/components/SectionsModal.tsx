import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Eye, EyeOff, GripVertical, Menu } from 'lucide-react';
import { useResume } from '../../../hooks/useResume';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import type { DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const sectionLabels: Record<string, string> = {
  personalInfo: "Personal Info",
  experience: "Experience", 
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  references: "References",
  interests: "Interests",
  customSections: "Custom Sections",
};

const ItemType = 'SECTION';

interface Section {
  key: string;
  visible: boolean;
  order: number;
}

interface DragItem {
  index: number;
}

interface SectionRowProps {
  section: Section;
  index: number;
  moveSection: (from: number, to: number) => void;
  toggleSectionVisibility: (key: string) => void;
}

function SectionRow({ section, index, moveSection, toggleSectionVisibility }: SectionRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: ItemType,
    hover(item: DragItem) {
      if (!ref.current) return;
      if (item.index === index) return;
      moveSection(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ cursor: 'move' }}
    >
      <span className="flex items-center gap-3">
        <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
        <span className="font-medium text-gray-800">{sectionLabels[section.key] || section.key}</span>
      </span>
      <button
        onClick={() => toggleSectionVisibility(section.key)}
        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? (
          <Eye className="h-5 w-5 text-green-600" />
        ) : (
          <EyeOff className="h-5 w-5 text-gray-400" />
        )}
      </button>
    </div>
  );
}

interface SectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectionsModal = ({ isOpen, onClose }: SectionsModalProps) => {
  const { state, dispatch } = useResume();

  const moveSection = (from: number, to: number) => {
    const sections = [...state?.resumeSettings?.sections || []];
    const [moved] = sections.splice(from, 1);
    sections.splice(to, 0, moved);
    // Update order property to match new array order
    const reordered = sections.map((s, idx) => ({ ...s, order: idx }));
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { sections: reordered } });
  };

  const toggleSectionVisibility = (key: string) => {
    const sections = state?.resumeSettings?.sections?.map((s: Section) =>
      s.key === key ? { ...s, visible: !s.visible } : s
    );
    dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: { sections } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-teal-600" />
            Manage Sections
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Drag sections to reorder them on your resume. Click the eye icon to show/hide sections.
          </p>
          
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state?.resumeSettings?.sections?.slice()
                .sort((a, b) => a.order - b.order)
                .map((section: Section, idx: number) => (
                  <SectionRow
                    key={section.key}
                    section={section}
                    index={idx}
                    moveSection={moveSection}
                    toggleSectionVisibility={toggleSectionVisibility}
                  />
                ))}
            </div>
          </DndProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionsModal; 