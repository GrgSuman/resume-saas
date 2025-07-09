import { useState } from "react";
import type { SkillCategory } from "../../../../context/resume/types";
import { Plus, Edit3, Trash2, X, Edit } from "lucide-react";
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

  const SkillsSection = ({ skills }: { skills: SkillCategory[] }) => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<SkillCategory>({
    category: "",
    items: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [editingSkillText, setEditingSkillText] = useState("");

  const handleAddNew = () => {
    setFormData({ category: "", items: [] });
    setEditingIndex(null);
    setNewSkill("");
    setEditingSkillIndex(null);
    setEditingSkillText("");
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, skillCategory: SkillCategory) => {
    setFormData({ ...skillCategory });
    setEditingIndex(index);
    setNewSkill("");
    setEditingSkillIndex(null);
    setEditingSkillText("");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Editing existing
      const updatedSkills = [...skills];
      updatedSkills[editingIndex] = formData;
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { skills: updatedSkills } });
    } else {
      // Adding new
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { skills: [...skills, formData] } });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ category: "", items: [] });
    setNewSkill("");
    setEditingSkillIndex(null);
    setEditingSkillText("");
  };

  const handleDelete = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    dispatch({ type: 'UPDATE_RESUME_DATA', payload: { skills: updatedSkills } });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items?.filter((_, i) => i !== index) || [],
    });
    if (editingSkillIndex === index) {
      setEditingSkillIndex(null);
      setEditingSkillText("");
    }
  };

  const handleEditSkillStart = (index: number, skill: string) => {
    setEditingSkillIndex(index);
    setEditingSkillText(skill);
  };

  const handleEditSkillSave = () => {
    if (editingSkillIndex !== null && editingSkillText.trim()) {
      const updatedSkills = [...(formData.items || [])];
      updatedSkills[editingSkillIndex] = editingSkillText.trim();
      setFormData({ ...formData, items: updatedSkills });
      setEditingSkillIndex(null);
      setEditingSkillText("");
    }
  };

  const handleEditSkillCancel = () => {
    setEditingSkillIndex(null);
    setEditingSkillText("");
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">SKILLS</h2>
        {state.resumeEditingMode && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Add Skills
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {skills.map((skillCategory, index) => (
        <div key={index} className="mb-1">
          <div className="flex justify-between items-start">
            <div>
              {skillCategory.category && (
                <>
                  <strong>{skillCategory.category}:</strong>{" "}
                  {skillCategory.items.slice(0, 6).join(", ")}
                </>
              )}
              {!skillCategory.category && (
                <>{skillCategory.items.slice(0, 6).join(", ")}</>
              )}
            </div>
            {state.resumeEditingMode && (
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleEdit(index, skillCategory)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingIndex !== null ? "Edit Skills" : "Add New Skills"}
      >
        <form className="space-y-6 font-sans" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Category (Optional)</label>
              <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Programming Languages" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Skills</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} placeholder="e.g., JavaScript" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
                <button type="button" onClick={handleAddSkill} className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold font-sans">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.items && formData.items.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium font-sans flex items-center gap-1">
                    {editingSkillIndex === idx ? (
                      <>
                        <input type="text" value={editingSkillText} onChange={e => setEditingSkillText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleEditSkillSave(); if (e.key === 'Escape') handleEditSkillCancel(); }} className="border border-blue-400 rounded px-2 py-1 text-xs font-sans" autoFocus />
                        <button type="button" onClick={handleEditSkillSave} className="text-green-600 hover:text-green-800 text-xs px-1 font-sans">✓</button>
                        <button type="button" onClick={handleEditSkillCancel} className="text-red-600 hover:text-red-800 text-xs px-1 font-sans">✗</button>
                      </>
                    ) : (
                      <>
                        {skill}
                        <button type="button" onClick={() => handleEditSkillStart(idx, skill)} className="ml-1 text-blue-500 hover:text-blue-700 text-xs font-sans"><Edit className="h-3 w-3" /></button>
                        <button type="button" onClick={() => handleRemoveSkill(idx)} className="ml-1 text-red-500 hover:text-red-700 text-xs font-sans"><X className="h-3 w-3" /></button>
                      </>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-3 bg-slate-50 -mx-6 px-6 pb-2 sticky bottom-0 z-10 font-sans">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium font-sans">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto font-sans">{editingIndex !== null ? "Update" : "Add"} Skills</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SkillsSection;
