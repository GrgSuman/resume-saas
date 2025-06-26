import { useState } from "react";
import type { Experience } from "../../../../types/resumeTypes";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
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
      dispatch({ type: 'RESUME_DATA', payload: { experience: updatedExperience } });
    } else {
      // Adding new
      dispatch({ type: 'RESUME_DATA', payload: { experience: [...experience, formData] } });
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
    dispatch({ type: 'RESUME_DATA', payload: { experience: updatedExperience } });
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Software Engineer"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="2020"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="Present"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
            <div className="space-y-2">
              {formData.achievements?.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">•</span>
                  {editingAchievementIndex === index ? (
                    // Edit mode for achievement
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingAchievementText}
                        onChange={(e) => setEditingAchievementText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditAchievementSave();
                          if (e.key === 'Escape') handleEditAchievementCancel();
                        }}
                        className="flex-1 border border-blue-500 rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={handleEditAchievementSave}
                        className="text-green-600 hover:text-green-800 text-xs px-2"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEditAchievementCancel}
                        className="text-red-600 hover:text-red-800 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    // View mode for achievement
                    <>
                      <span className="flex-1 text-sm">{achievement}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditAchievementStart(index, achievement)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddAchievement()}
                  placeholder="Add achievement..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddAchievement}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingIndex !== null ? "Update" : "Add"} Experience
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExperienceSection;
