import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Project } from "../../../context/resume/types";

interface ProjectsFormProps {
  isOpen: boolean;
  data: Project[];
  onSave: (data: Project[]) => void;
  onClose: () => void;
}

const ProjectsForm = ({ isOpen, data, onSave, onClose }: ProjectsFormProps) => {
  const [projects, setProjects] = useState<Project[]>(data || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>({
    name: "",
    achievements: [],
    link: ""
  });
  const [newAchievement, setNewAchievement] = useState("");
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number | null>(null);
  const [editingAchievementText, setEditingAchievementText] = useState("");

  useEffect(() => {
    setProjects(data || []);
  }, [data]);

  const handleAddNew = () => {
    setFormData({
      name: "",
      achievements: [],
      link: ""
    });
    setEditingIndex(null);
  };

  const handleEdit = (index: number, project: Project) => {
    setFormData({ ...project });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleSave = () => {
    if (!formData.name) return;

    let updatedProjects;
    if (editingIndex !== null) {
      updatedProjects = [...projects];
      updatedProjects[editingIndex] = formData;
    } else {
      updatedProjects = [...projects, formData];
    }

    setProjects(updatedProjects);
    setFormData({
      name: "",
      achievements: [],
      link: ""
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
    onSave(projects);
  };

  const handleClose = () => {
    setProjects(data || []);
    setFormData({
      name: "",
      achievements: [],
      link: ""
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
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 font-sans">Manage Projects</h3>
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
            {/* Left side - Projects List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Project Entries</h4>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <Plus className="h-3 w-3" />
                  Add New
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{project.name}</div>
                        {project.link && (
                          <div className="text-sm text-blue-600">
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              View Project
                            </a>
                          </div>
                        )}
                        {project.achievements && project.achievements.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {project.achievements.length} achievement{project.achievements.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEdit(index, project)}
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
                {editingIndex !== null ? "Edit Project" : "Add New Project"}
              </h4>
              
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E-commerce Website"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                  <input
                    type="url"
                    value={formData.link || ""}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Achievements</label>
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
                    {editingIndex !== null ? "Update Project" : "Add Project"}
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

export default ProjectsForm;
