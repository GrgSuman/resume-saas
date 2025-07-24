import { useState } from "react";
import type { Reference } from "../../../../context/resume/types";
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fade-in font-sans">
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

const ReferenceSection = ({ references }: { references: Reference[] }) => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Reference>({
    name: "",
    position: "",
    company: "",
    contact: "",
    relationship: "",
  });

  const handleAddNew = () => {
    setFormData({ name: "", position: "", company: "", contact: "", relationship: "" });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, reference: Reference) => {
    setFormData({ ...reference });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Editing existing
      const updatedReferences = [...references];
      updatedReferences[editingIndex] = formData;
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { references: updatedReferences } });
    } else {
      // Adding new
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { references: [...references, formData] } });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ name: "", position: "", company: "", contact: "", relationship: "" });
  };

  const handleDelete = (index: number) => {
    const updatedReferences = references.filter((_, i) => i !== index);
    dispatch({ type: 'UPDATE_RESUME_DATA', payload: { references: updatedReferences } });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">REFERENCES</h2>
        {state.resumeEditingMode && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Add Reference
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {references.map((ref, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-bold">
                  {ref.name}{ref.name && ref.position && ' — '}{ref.position}
                </div>
                <div>
                  {ref.company}
                  {ref.company && ref.contact && ' | '}
                  {ref.contact}
                  {((ref.company || ref.contact) && ref.relationship) && ' | '}
                  {ref.relationship}
                </div>
              </div>
              {state.resumeEditingMode && (
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(index, ref)}
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
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingIndex !== null ? "Edit Reference" : "Add New Reference"}
      >
        <form className="space-y-6 font-sans" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Full Name *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" required />
            </div>
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Position</label>
                <input type="text" value={formData.position || ""} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="Software Engineer" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Company</label>
                <input type="text" value={formData.company || ""} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Tech Solutions Inc." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Contact</label>
                <input type="text" value={formData.contact || ""} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="john.doe@email.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Relationship</label>
                <input type="text" value={formData.relationship || ""} onChange={e => setFormData({ ...formData, relationship: e.target.value })} placeholder="Manager, Colleague, etc." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-3 bg-slate-50 -mx-6 px-6 pb-2 sticky bottom-0 z-10 font-sans">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium font-sans">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto font-sans">{editingIndex !== null ? "Update" : "Add"} Reference</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReferenceSection;
