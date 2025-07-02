import { useState } from "react";
import type { Project } from "../../../../context/resume/types";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>({
    name: "",
    achievements: [],
    link: "",
  });
  const [newAchievement, setNewAchievement] = useState("");
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<
    number | null
  >(null);
  const [editingAchievementText, setEditingAchievementText] = useState("");

  const handleAddNew = () => {
    setFormData({ name: "", achievements: [], link: "" });
    setEditingIndex(null);
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, project: Project) => {
    setFormData({ ...project });
    setEditingIndex(index);
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Editing existing
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = formData;
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { projects: updatedProjects } });
    } else {
      // Adding new
      dispatch({ type: 'UPDATE_RESUME_DATA', payload: { projects: [...projects, formData] } });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ name: "", achievements: [], link: "" });
    setNewAchievement("");
    setEditingAchievementIndex(null);
    setEditingAchievementText("");
  };

  const handleDelete = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    dispatch({ type: 'UPDATE_RESUME_DATA', payload: { projects: updatedProjects } });
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), newAchievement.trim()],
      });
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.filter((_, i) => i !== index) || [],
    });
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
      updatedAchievements[editingAchievementIndex] =
        editingAchievementText.trim();
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
        <h2 className="font-bold tracking-wide uppercase">SOFTWARE PROJECTS</h2>
        {state.resumeEditingMode && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Add Project
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {projects.map((project, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
          <span className="font-bold">{project.name}</span>
            <div className="flex gap-3">
              {project.link && (
                <a
                  href={project.link}
                  className="text-blue-700 ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xs">Project Link</span>
                </a>
              )}
              {state.resumeEditingMode && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(index, project)}
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
          {project.achievements && (
            <div className="ml-4">
              {project.achievements.map((achievement, achIndex) => (
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
        title={editingIndex !== null ? "Edit Project" : "Add New Project"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="E-commerce Website"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Link (Optional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://github.com/username/project"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements
            </label>
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
                        onChange={(e) =>
                          setEditingAchievementText(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditAchievementSave();
                          if (e.key === "Escape") handleEditAchievementCancel();
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
                          onClick={() =>
                            handleEditAchievementStart(index, achievement)
                          }
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
              {editingIndex !== null ? "Update" : "Add"} Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsSection;
