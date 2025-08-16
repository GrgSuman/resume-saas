import { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { X, Check, Grid, List } from "lucide-react";
import { useResume } from "../../../hooks/useResume";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const templates = [
  {
    id: "Professional",
    name: "Professional",
    image: "/professional.png",
    description: "Clean and traditional layout"
  },
  {
    id: "Modern",
    name: "Modern",
    image: "/modern.png",
    description: "Contemporary design with bold elements"
  },
  {
    id: "Creative",
    name: "Creative",
    image: "/creative.png",
    description: "Unique and artistic layout"
  },
  {
    id: "Two Column",
    name: "Two Column",
    image: "/twocolumn.png",
    description: "Side-by-side layout for more content"
  }
];

const TemplateSelector = ({ isOpen, onClose }: TemplateSelectorProps) => {
  const { state, dispatch } = useResume();
  const currentTemplate = state.resumeSettings?.template || "Professional";
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleTemplateSelect = (templateId: string) => {
    dispatch({
      type: "UPDATE_RESUME_SETTINGS",
      payload: { template: templateId },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 mb-4 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Choose Template
          </h3>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Template Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {templates.map((template) => (
              <div
                key={template.id}
                className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                  currentTemplate === template.id
                    ? "border-[#7060fc] shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                } ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {/* Selected Checkmark */}
                {currentTemplate === template.id && (
                  <div className="absolute top-3 right-3 z-10 bg-[#7060fc] text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                {/* Template Image */}
                <div className={`overflow-hidden rounded-t-lg ${viewMode === 'list' ? 'w-20 h-24 mr-4' : 'aspect-[3/4]'}`}>
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* Template Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4 bg-gray-50 rounded-b-lg'}`}>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {template.description}
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;