import { useState } from "react";
import type { SkillCategory } from "../../../../types/resumeTypes";
import { Plus, Edit3, Trash2, X, Edit } from "lucide-react";
import { useResume } from "../../../../context/new/ResumeContextData";

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
      dispatch({ type: 'RESUME_DATA', payload: { skills: updatedSkills } });
    } else {
      // Adding new
      dispatch({ type: 'RESUME_DATA', payload: { skills: [...skills, formData] } });
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
    dispatch({ type: 'RESUME_DATA', payload: { skills: updatedSkills } });
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category (Optional)
            </label>
            <input
              type="text"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g., Programming Languages, Frameworks"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="space-y-2">
              {formData.items?.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">•</span>
                  {editingSkillIndex === index ? (
                    // Edit mode for skill
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingSkillText}
                        onChange={(e) => setEditingSkillText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSkillSave();
                          if (e.key === "Escape") handleEditSkillCancel();
                        }}
                        className="flex-1 border border-blue-500 rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={handleEditSkillSave}
                        className="text-green-600 hover:text-green-800 text-xs px-2"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEditSkillCancel}
                        className="text-red-600 hover:text-red-800 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    // View mode for skill
                    <>
                      <span className="flex-1 text-sm">{skill}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditSkillStart(index, skill)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveSkill(index)}
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
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add skill..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSkill}
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
              {editingIndex !== null ? "Update" : "Add"} Skills
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsSection;
