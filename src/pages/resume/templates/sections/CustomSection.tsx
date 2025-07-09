import { useState } from "react";
import type { CustomSection } from "../../../../context/resume/types";
import { Plus, Edit3, Trash2, X } from "lucide-react";
import { useResume } from "../../../../hooks/useResume";

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 font-sans" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fade-in font-sans">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white font-sans">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 font-sans">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-200 font-sans" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-slate-50 px-6 py-6 overflow-y-auto flex-1 font-sans">{children}</div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
};

  const CustomSectionComponent = ({ customSections }: { customSections: CustomSection[] }) => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CustomSection>({
    title: "",
    content: "",
  });

  const handleAddNew = () => {
    setFormData({ title: "", content: "" });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, customSection: CustomSection) => {
    setFormData({ ...customSection });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Editing existing
      const updatedCustomSections = [...customSections];
      updatedCustomSections[editingIndex] = formData;
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { customSections: updatedCustomSections } });
    } else {
      // Adding new
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { customSections: [...customSections, formData] } });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ title: "", content: "" });
  };

  const handleDelete = (index: number) => {
    const updatedCustomSections = customSections.filter((_, i) => i !== index);
    dispatch({ type: 'UPDATE_RESUME_DATA', payload: { customSections: updatedCustomSections } });
  };

  return (
    <>
      {customSections && customSections.length > 0 && (
        <div className="mb-4">
          {customSections.map((section, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-bold mb-1 tracking-wide uppercase">
                  {section.title}
                </h2>
                {state.resumeEditingMode && (
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEdit(index, section)}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                      title="Edit"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              <div className="border-b border-black mb-2"></div>
              <div>{section.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add button when no custom sections exist */}
      {state.resumeEditingMode && (!customSections || customSections.length === 0) && (
        <div className="mb-4">
          <div className="flex justify-end items-center mb-1">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              <Plus className="h-3 w-3" />
              Add Custom Section
            </button>
          </div>
        </div>
      )}

      {/* Add button when custom sections exist */}
      {state.resumeEditingMode && customSections && customSections.length > 0 && (
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Add Custom Section
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingIndex !== null ? "Edit Custom Section" : "Add New Custom Section"}
      >
        <form className="space-y-6 font-sans" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Section Title *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Awards, Publications, Languages" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Section Content *</label>
              <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Enter the content for this custom section..." rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition resize-vertical font-sans" required />
              <p className="text-xs text-gray-500 mt-1 font-sans">You can use plain text or basic formatting. Each line will be displayed as a separate paragraph.</p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-3 bg-slate-50 -mx-6 px-6 pb-2 sticky bottom-0 z-10 font-sans">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium font-sans">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto font-sans">{editingIndex !== null ? "Update" : "Add"} Section</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CustomSectionComponent;
