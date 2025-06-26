import { useState } from "react";
import type { PersonalInfo } from "../../../../types/resumeTypes";
import { Edit3, X } from "lucide-react";
import { useResume } from "../../../../context/resume/ResumeContext";

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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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

const PersonalInfoSection = ({personalInfo}:{personalInfo:PersonalInfo}) => {
  const {state,dispatch} = useResume()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>(personalInfo);

  const handleEdit = () => {
    setFormData({ ...personalInfo });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    dispatch({ type: 'RESUME_DATA', payload: { personalInfo: formData } });
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
      <div className="text-center mb-3 border-b-1 border-black pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className="text-left flex-1">
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {personalInfo.github && (
              <div className="mt-1">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.github}
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="mt-1">
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.linkedin}
                </a>
              </div>
            )}
            {personalInfo.twitter && (
              <div className="mt-1">
                <a
                  href={personalInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.twitter}
                </a>
              </div>
            )}
          </div>
          <div className="flex-1 text-center">
            <h1
              className="font-bold tracking-wider"
              style={{ fontSize: "20px" }}
            >
              {personalInfo.name.toUpperCase()}
            </h1>
            {personalInfo.label && (
              <div className="text-sm text-gray-600 mt-1">
                {personalInfo.label}
              </div>
            )}
          </div>
          <div className="text-right flex-1">
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && (
              <div className="mt-1">
                <a
                  href={`mailto:${personalInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="mt-1">
                <a
                  href={personalInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.portfolio}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">SUMMARY</h2>
          <div className="border-b border-black mb-2"></div>
          <div>
            <div className="mb-1">{personalInfo.summary}</div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Edit Personal Information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Label
              </label>
              <input
                type="text"
                value={formData.label || ""}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Full Stack Developer"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="123 Main St, City, State 12345"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Summary
            </label>
            <textarea
              value={formData.summary || ""}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              placeholder="Brief professional summary..."
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio
              </label>
              <input
                type="url"
                value={formData.portfolio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio: e.target.value })
                }
                placeholder="https://johndoe.com/portfolio"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/johndoe"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub
              </label>
              <input
                type="url"
                value={formData.github || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="https://github.com/johndoe"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="url"
              value={formData.twitter || ""}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              placeholder="https://twitter.com/johndoe"
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
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PersonalInfoSection;
