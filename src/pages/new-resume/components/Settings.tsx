import { useRef } from 'react';
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Settings as SettingsIcon, Eye, EyeOff, GripVertical } from 'lucide-react'
import { useResume } from '../../../context/new/ResumeContextData'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import type { DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
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
    hover(item: DragItem, _monitor: DropTargetMonitor) {
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
      className={`flex items-center justify-between bg-gray-50 rounded px-2 py-1 ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <span className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
        <span className="font-medium">{sectionLabels[section.key] || section.key}</span>
      </span>
      <button
        onClick={() => toggleSectionVisibility(section.key)}
        className="p-1 rounded hover:bg-gray-200"
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? (
          <Eye className="h-4 w-4 text-green-600" />
        ) : (
          <EyeOff className="h-4 w-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}

const Settings = () => {
  const { state, dispatch } = useResume();

  // DnD reorder logic
  const moveSection = (from: number, to: number) => {
    const sections = [...state.resumeSettings.sections];
    const [moved] = sections.splice(from, 1);
    sections.splice(to, 0, moved);
    // Update order property to match new array order
    const reordered = sections.map((s, idx) => ({ ...s, order: idx }));
    dispatch({ type: "RESUME_SETTINGS", payload: { sections: reordered } });
  };

  const toggleSectionVisibility = (key: string) => {
    const sections = state.resumeSettings.sections.map((s: Section) =>
      s.key === key ? { ...s, visible: !s.visible } : s
    );
    dispatch({ type: "RESUME_SETTINGS", payload: { sections } });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Settings Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <SettingsIcon className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold">Settings</h3>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto px-3 ">
        {/* Resume Information */}
        <div>
          <Label className='my-1 mt-4' htmlFor="resume-title">Resume Title</Label>
          <Input
            id="resume-title"
            placeholder="e.g., Software Engineer Resume"
            defaultValue="My Professional Resume"
          />
        </div>

        {/* Appearance Settings */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className='my-1 mt-4' htmlFor="font-family">Font Family</Label>
              <Select defaultValue="sans-serif">
                <SelectTrigger className="w-32 mt-1">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans-serif">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className='my-1 mt-4' htmlFor="font-size">Font Size</Label>
              <Select defaultValue="12">
                <SelectTrigger className="w-32 mt-1">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="13">13</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Template Settings */}
        <div>
          <Label className='my-1 mt-4' htmlFor="template">Template</Label>
          <Select defaultValue="templateOne">
            <SelectTrigger className="w-48 mt-1">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="templateOne">Template One</SelectItem>
              <SelectItem value="templateTwo">Template Two</SelectItem>
              <SelectItem value="templateThree">Template Three</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sections Management */}
        <div className="mt-6">
          <Label className="mb-2 block text-base font-semibold">Sections</Label>
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col gap-2 pb-5">
              {state.resumeSettings.sections
                .slice()
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
      </div>
    </div>
  )
}

export default Settings