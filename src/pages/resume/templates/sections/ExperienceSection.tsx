import { useState } from "react";
import type { Experience } from "../../../../context/resume/types";
import { Plus, Edit3, Trash2, X, Edit } from "lucide-react";
import { useResume } from "../../../../hooks/useResume";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: { 
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

const ExperienceSection = ({ experience }: { experience: Experience[] }) => {
  const {state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Experience>({
    company: "", role: "", startDate: "", endDate: "", location: "", achievements: []
  });
  const [newAchievement, setNewAchievement] = useState("");
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number | null>(null);
  const [editingAchievementText, setEditingAchievementText] = useState("");

  const handleAddNew = () => {
    setFormData({ company: "", role: "", startDate: "", endDate: "", location: "", achievements: [] });
    setEditingIndex(null);
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, exp: Experience) => {
    setFormData({ ...exp });
    setEditingIndex(index);
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Editing existing
      const updatedExperience = [...experience];
      updatedExperience[editingIndex] = formData;
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { experience: updatedExperience } });
    } else {
      // Adding new
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { experience: [...experience, formData] } });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ company: "", role: "", startDate: "", endDate: "", location: "", achievements: [] });
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
  };

  const handleDelete = (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    dispatch({ type: 'UPDATE_RESUME_DATA', payload: { experience: updatedExperience } });
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({ ...formData, achievements: [...(formData.achievements || []), newAchievement.trim()] });
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData({ ...formData, achievements: formData.achievements?.filter((_, i) => i !== index) || [] });
    if (editingAchievementIndex === index) {
      setEditingAchievementIndex(null);
      setEditingAchievementText("");
    }
  };

  const handleEditAchievementStart = (index: number, achievement: string) => {
    setEditingAchievementIndex(index);
    setEditingAchievementText(achievement);
  };

  const handleEditAchievementSave = () => {
    if (editingAchievementIndex !== null && editingAchievementText.trim()) {
      const updatedAchievements = [...(formData.achievements || [])];
      updatedAchievements[editingAchievementIndex] = editingAchievementText.trim();
      setFormData({ ...formData, achievements: updatedAchievements });
      setEditingAchievementIndex(null);
      setEditingAchievementText("");
    }
  };

  const handleEditAchievementCancel = () => {
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">EMPLOYMENT</h2>
        {state.resumeEditingMode && (
          <button onClick={handleAddNew} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
            <Plus className="h-3 w-3" />
            Add Experience
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {experience.map((exp, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div><span className="font-bold">{exp.role}</span></div>
            <div className="flex gap-2">
              <div>{exp.startDate}{exp.startDate && exp.endDate && ' - '}{exp.endDate}</div>
              {state.resumeEditingMode && (
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(index, exp)} className="text-blue-500 hover:text-blue-700 text-xs" title="Edit">
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 text-xs" title="Delete">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div><span>{exp.company}{exp.company && exp.location && ' - '}{exp.location}</span></div>
          {exp.achievements && (
            <div className="mt-1 ml-4">
              {exp.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="mb-1 flex">
                  <span className="mr-2">•</span>
                  <span className="flex-1">{achievement}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        title={editingIndex !== null ? "Edit Experience" : "Add New Experience"}
      >
        <form className="space-y-6 font-sans" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Role</label>
                <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Software Engineer" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Company</label>
                <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Company Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Start Date</label>
                <input type="text" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} placeholder="Jan 2020" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">End Date</label>
                <input type="text" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} placeholder="Dec 2022" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="New York, NY" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Achievements</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={newAchievement} onChange={e => setNewAchievement(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())} placeholder="e.g., Led a team of 5 engineers" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
                <button type="button" onClick={handleAddAchievement} className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold font-sans">Add</button>
              </div>
              <div className="flex flex-col gap-2">
                {formData.achievements && formData.achievements.map((ach, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-xs font-medium font-sans flex items-center gap-1">
                    {editingAchievementIndex === idx ? (
                      <>
                        <input type="text" value={editingAchievementText} onChange={e => setEditingAchievementText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleEditAchievementSave(); if (e.key === 'Escape') handleEditAchievementCancel(); }} className="border border-blue-400 rounded px-2 py-1 text-xs font-sans" autoFocus />
                        <button type="button" onClick={handleEditAchievementSave} className="text-green-600 hover:text-green-800 text-xs px-1 font-sans">✓</button>
                        <button type="button" onClick={handleEditAchievementCancel} className="text-red-600 hover:text-red-800 text-xs px-1 font-sans">✗</button>
                      </>
                    ) : (
                      <>
                        {ach}
                        <button type="button" onClick={() => handleEditAchievementStart(idx, ach)} className="ml-1 text-blue-500 hover:text-blue-700 text-xs font-sans"><Edit className="h-3 w-3" /></button>
                        <button type="button" onClick={() => handleRemoveAchievement(idx)} className="ml-1 text-red-500 hover:text-red-700 text-xs font-sans"><X className="h-3 w-3" /></button>
                      </>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-3 bg-slate-50 -mx-6 px-6 pb-2 sticky bottom-0 z-10 font-sans">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium font-sans">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto font-sans">{editingIndex !== null ? "Update" : "Add"} Experience</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExperienceSection;
