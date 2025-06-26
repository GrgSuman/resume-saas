import { useState } from "react";
import type { Education } from "../../../../types/resumeTypes";
import { Plus, Edit3, Trash2, X } from "lucide-react";
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

const EducationSection = ({ education }: { education: Education[] }) => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Education>({
    institution: "", degree: "", description: "", startDate: "", endDate: "", grade: ""
  });

  const handleAddNew = () => {
    setFormData({ institution: "", degree: "", description: "", startDate: "", endDate: "", grade: "" });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, edu: Education) => {
    setFormData({ ...edu });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Editing existing
      const updatedEducation = [...education];
      updatedEducation[editingIndex] = formData;
      dispatch({ type: 'RESUME_DATA', payload: { education: updatedEducation } });
    } else {
      // Adding new
      dispatch({ type: 'RESUME_DATA', payload: { education: [...education, formData] } });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData({ institution: "", degree: "", description: "", startDate: "", endDate: "", grade: "" });
  };

  const handleDelete = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    dispatch({ type: 'RESUME_DATA', payload: { education: updatedEducation } });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">EDUCATION</h2>
        {state.resumeEditingMode && (
          <button onClick={handleAddNew} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
            <Plus className="h-3 w-3" />
            Add Education
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {education.map((edu, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div><span className="font-bold">{edu.institution}</span></div>
            <div className="flex gap-2">
              <div>{edu.startDate}{edu.startDate && edu.endDate && ' - '}{edu.endDate}</div>
              {state.resumeEditingMode && (
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(index, edu)} className="text-blue-500 hover:text-blue-700 text-xs" title="Edit">
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 text-xs" title="Delete">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="mb-1">
              {edu.degree}{edu.degree && edu.grade && ' - '}{edu.grade}
              {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        title={editingIndex !== null ? "Edit Education" : "Add New Education"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="University Name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="Bachelor of Science in Computer Science"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="2018"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="2022"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade/GPA (Optional)</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="3.8/4.0"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Relevant coursework, honors, activities..."
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {editingIndex !== null ? "Update" : "Add"} Education
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EducationSection;
