import { useState } from "react";
import type { PersonalInfo } from "../../../../context/resume/types";
import { Edit3, X } from "lucide-react";
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fade-in font-sans">
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

const PersonalInfoSection = ({personalInfo}:{personalInfo:PersonalInfo}) => {
  const {state,dispatch} = useResume()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>(personalInfo);

  const handleEdit = () => {
    setFormData({ ...personalInfo });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_RESUME_DATA', payload: { personalInfo: formData } });
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({ ...personalInfo });
  };

  return (
    <div className="mb-4">
      {state.resumeEditingMode && (
        <div className="flex justify-end items-center mb-1">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Edit3 className="h-3 w-3" />
            Edit Info
          </button>
        </div>
      )}

      {/* Name */}
      <div className="text-center mb-1">
        <h1
          className="font-bold tracking-wider text-black"
          style={{ fontSize: "20px", textTransform: "uppercase" }}
        >
          {personalInfo.name}
        </h1>
        <div className="text-sm my-1 flex flex-wrap justify-center gap-x-2">
          {[
            personalInfo.label,
            personalInfo.email && <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>,
            personalInfo.phone,
            personalInfo.address
          ].filter(Boolean).map((item, idx, arr) => (
            <span key={idx} className="block">
              {item}{idx < arr.length - 1 && " | "}
            </span>
          ))}
        </div>
        <div className="text-sm flex mt-1 flex-wrap justify-center gap-x-2">
          {[
            personalInfo.linkedin && <a href={personalInfo.linkedin}>LinkedIn</a>,
            personalInfo.github && <a href={personalInfo.github}>GitHub</a>,
            personalInfo.twitter && <a href={personalInfo.twitter}>Twitter</a>,
            personalInfo.portfolio && <a href={personalInfo.portfolio}>Portfolio</a>
          ].filter(Boolean).map((item, idx, arr) => (
            <span key={idx} className="block">
              {item}{idx < arr.length - 1 && " | "}
            </span>
          ))}
        </div>
      </div>

      {/* Horizontal line */}
      <hr className="border-black my-4" />
      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-4">
          <div className="font-bold mb-1 tracking-wide uppercase text-black">
            SUMMARY
          </div>
          <div className="text-black">{personalInfo.summary}</div>
        </div>
      )}

      {/* Horizontal line */}
      <hr className="border-black my-4" />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Edit Personal Information"
      >
        <form className="space-y-6 font-sans" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Professional Label</label>
              <input type="text" value={formData.label || ""} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="Full Stack Developer" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email <span className="text-red-500">*</span></label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john.doe@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Phone</label>
              <input type="tel" value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 123-4567" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Address</label>
              <input type="text" value={formData.address || ""} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St, City, State 12345" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Professional Summary</label>
              <textarea value={formData.summary || ""} onChange={e => setFormData({ ...formData, summary: e.target.value })} placeholder="Brief professional summary..." rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition resize-vertical font-sans" />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Portfolio</label>
                <input type="url" value={formData.portfolio || ""} onChange={e => setFormData({ ...formData, portfolio: e.target.value })} placeholder="https://johndoe.com/portfolio" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">LinkedIn</label>
                <input type="url" value={formData.linkedin || ""} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/johndoe" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">GitHub</label>
                <input type="url" value={formData.github || ""} onChange={e => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/johndoe" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Twitter</label>
                <input type="url" value={formData.twitter || ""} onChange={e => setFormData({ ...formData, twitter: e.target.value })} placeholder="https://twitter.com/johndoe" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition font-sans" />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-3 bg-slate-50 -mx-6 px-6 pb-2 sticky bottom-0 z-10 font-sans">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium font-sans">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto font-sans">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PersonalInfoSection;
