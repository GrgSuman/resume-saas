import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Education } from "../../../context/resume/types";

interface EducationFormProps {
  isOpen: boolean;
  data: Education[];
  onSave: (data: Education[]) => void;
  onClose: () => void;
}

const EducationForm = ({ isOpen, data, onSave, onClose }: EducationFormProps) => {
  const [educations, setEducations] = useState<Education[]>(data || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Education>({
    institution: "",
    degree: "",
    description: "",
    startDate: "",
    endDate: "",
    grade: ""
  });

  useEffect(() => {
    setEducations(data || []);
  }, [data]);

  const handleAddNew = () => {
    setFormData({
      institution: "",
      degree: "",
      description: "",
      startDate: "",
      endDate: "",
      grade: ""
    });
    setEditingIndex(null);
  };

  const handleEdit = (index: number, education: Education) => {
    setFormData({ ...education });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
  };

  const handleSave = () => {
    if (!formData.institution || !formData.degree) return;

    let updatedEducations;
    if (editingIndex !== null) {
      updatedEducations = [...educations];
      updatedEducations[editingIndex] = formData;
    } else {
      updatedEducations = [...educations, formData];
    }

    setEducations(updatedEducations);
    setFormData({
      institution: "",
      degree: "",
      description: "",
      startDate: "",
      endDate: "",
      grade: ""
    });
    setEditingIndex(null);
  };

  const handleFinalSave = () => {
    onSave(educations);
  };

  const handleClose = () => {
    setEducations(data || []);
    setFormData({
      institution: "",
      degree: "",
      description: "",
      startDate: "",
      endDate: "",
      grade: ""
    });
    setEditingIndex(null);
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
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 font-sans">Manage Education</h3>
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
            {/* Left side - Education List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Education Entries</h4>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <Plus className="h-3 w-3" />
                  Add New
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {educations.map((edu, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-sm text-gray-600">{edu.institution}</div>
                        <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</div>
                        {edu.grade && <div className="text-xs text-gray-500">Grade: {edu.grade}</div>}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEdit(index, edu)}
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
                {editingIndex !== null ? "Edit Education" : "Add New Education"}
              </h4>
              
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={formData.institution || ""}
                      onChange={e => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="University Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={formData.degree || ""}
                      onChange={e => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="Bachelor of Science"
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
                      placeholder="Sep 2018"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={formData.endDate || ""}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      placeholder="May 2022"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade/GPA</label>
                  <input
                    type="text"
                    value={formData.grade || ""}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="3.8/4.0 or First Class"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your studies, major, relevant coursework..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition resize-vertical"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                  >
                    {editingIndex !== null ? "Update Education" : "Add Education"}
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

export default EducationForm;
