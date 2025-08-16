import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Experience } from "../../../context/resume/types";

interface ExperienceFormProps {
  isOpen: boolean;
  data: Experience[];
  onSave: (data: Experience[]) => void;
  onClose: () => void;
}

const ExperienceForm = ({ isOpen, data, onSave, onClose }: ExperienceFormProps) => {
  const [experiences, setExperiences] = useState<Experience[]>(data || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Experience>({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    location: "",
    achievements: []
  });
  const [newAchievement, setNewAchievement] = useState("");
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number | null>(null);
  const [editingAchievementText, setEditingAchievementText] = useState("");

  useEffect(() => {
    setExperiences(data || []);
  }, [data]);

  const handleAddNew = () => {
    setFormData({
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      achievements: []
    });
    setEditingIndex(null);
  };

  const handleEdit = (index: number, experience: Experience) => {
    setFormData({ ...experience });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleSave = () => {
    if (!formData.role || !formData.company) return;

    let updatedExperiences;
    if (editingIndex !== null) {
      updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = formData;
    } else {
      updatedExperiences = [...experiences, formData];
    }

    setExperiences(updatedExperiences);
    setFormData({
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      achievements: []
    });
    setEditingIndex(null);
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), newAchievement.trim()]
      });
      setNewAchievement("");
    }
  };

  const handleDeleteAchievement = (index: number) => {
    const updatedAchievements = formData.achievements?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, achievements: updatedAchievements });
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

  const handleFinalSave = () => {
    onSave(experiences);
  };

  const handleClose = () => {
    setExperiences(data || []);
    setFormData({
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      achievements: []
    });
    setEditingIndex(null);
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 font-sans"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fade-in font-sans">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white font-sans">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 font-sans">Manage Experience</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-200 font-sans"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-slate-50 px-6 py-6 overflow-y-auto flex-1 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Experience List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Experience Entries</h4>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <Plus className="h-3 w-3" />
                  Add New
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {experiences.map((exp, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{exp.role}</div>
                        <div className="text-sm text-gray-600">{exp.company}</div>
                        <div className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEdit(index, exp)}
                          className="text-blue-500 hover:text-blue-700 text-xs p-1"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                {editingIndex !== null ? "Edit Experience" : "Add New Experience"}
              </h4>
              
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={formData.role || ""}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Software Engineer"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company || ""}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={formData.startDate || ""}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      placeholder="Jan 2020"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={formData.endDate || ""}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      placeholder="Dec 2022"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="New York, NY"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                  <div className="space-y-2">
                    {formData.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {editingAchievementIndex === index ? (
                          <>
                            <input
                              type="text"
                              value={editingAchievementText}
                              onChange={e => setEditingAchievementText(e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              type="button"
                              onClick={handleEditAchievementSave}
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={handleEditAchievementCancel}
                              className="text-gray-600 hover:text-gray-800 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm">• {achievement}</span>
                            <button
                              type="button"
                              onClick={() => handleEditAchievementStart(index, achievement)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAchievement(index)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAchievement}
                        onChange={e => setNewAchievement(e.target.value)}
                        placeholder="Add new achievement..."
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                      />
                      <button
                        type="button"
                        onClick={handleAddAchievement}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                  >
                    {editingIndex !== null ? "Update Experience" : "Add Experience"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
          >
            Save All Changes
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
};

export default ExperienceForm;
