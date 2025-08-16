import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { SkillCategory } from "../../../context/resume/types";

interface SkillsFormProps {
  isOpen: boolean;
  data: SkillCategory[];
  onSave: (data: SkillCategory[]) => void;
  onClose: () => void;
}

const SkillsForm = ({ isOpen, data, onSave, onClose }: SkillsFormProps) => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(data || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<SkillCategory>({
    category: "",
    items: []
  });
  const [newSkill, setNewSkill] = useState("");
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [editingSkillText, setEditingSkillText] = useState("");

  useEffect(() => {
    setSkillCategories(data || []);
  }, [data]);

  const handleAddNew = () => {
    setFormData({
      category: "",
      items: []
    });
    setEditingIndex(null);
  };

  const handleEdit = (index: number, category: SkillCategory) => {
    setFormData({ ...category });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedCategories = skillCategories.filter((_, i) => i !== index);
    setSkillCategories(updatedCategories);
  };

  const handleSave = () => {
    if (!formData.category) return;

    let updatedCategories;
    if (editingIndex !== null) {
      updatedCategories = [...skillCategories];
      updatedCategories[editingIndex] = formData;
    } else {
      updatedCategories = [...skillCategories, formData];
    }

    setSkillCategories(updatedCategories);
    setFormData({
      category: "",
      items: []
    });
    setEditingIndex(null);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = formData.items?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, items: updatedSkills });
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

  const handleFinalSave = () => {
    onSave(skillCategories);
  };

  const handleClose = () => {
    setSkillCategories(data || []);
    setFormData({
      category: "",
      items: []
    });
    setEditingIndex(null);
    setNewSkill("");
    setEditingSkillIndex(null);
    setEditingSkillText("");
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
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 font-sans">Manage Skills</h3>
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
            {/* Left side - Skills Categories List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Skill Categories</h4>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <Plus className="h-3 w-3" />
                  Add Category
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {skillCategories.map((category, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {category.items?.join(", ") || "No skills added"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {category.items?.length || 0} skill{(category.items?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEdit(index, category)}
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
                {editingIndex !== null ? "Edit Skill Category" : "Add New Skill Category"}
              </h4>
              
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={formData.category || ""}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Programming Languages"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="space-y-2">
                    {formData.items?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {editingSkillIndex === index ? (
                          <>
                            <input
                              type="text"
                              value={editingSkillText}
                              onChange={e => setEditingSkillText(e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              type="button"
                              onClick={handleEditSkillSave}
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={handleEditSkillCancel}
                              className="text-gray-600 hover:text-gray-800 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm">• {skill}</span>
                            <button
                              type="button"
                              onClick={() => handleEditSkillStart(index, skill)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(index)}
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
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        placeholder="Add new skill..."
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
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
                    {editingIndex !== null ? "Update Category" : "Add Category"}
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

export default SkillsForm;
