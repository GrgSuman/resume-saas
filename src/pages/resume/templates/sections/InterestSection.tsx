import { useState } from "react";
import { Plus, Trash2, X, Edit } from "lucide-react";
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

const InterestSection = ({ interests  }: { interests: string[] }) => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddNew = () => {
    setNewInterest("");
    setEditingIndex(null);
    setEditingText("");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setNewInterest("");
    setEditingText("");
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      dispatch({ type: 'RESUME_DATA', payload: { interests: [...interests, newInterest.trim()] } });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    dispatch({ type: 'RESUME_DATA', payload: { interests: updatedInterests } });
  };

  const handleEditInterestStart = (index: number, interest: string) => {
    setEditingIndex(index);
    setEditingText(interest);
  };

  const handleEditInterestSave = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updatedInterests = [...interests];
      updatedInterests[editingIndex] = editingText.trim();
      dispatch({ type: 'RESUME_DATA', payload: { interests: updatedInterests } });
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const handleEditInterestCancel = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">INTERESTS</h2>
        {state.resumeEditingMode && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Add Interest
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <div key={index} className="flex items-center gap-1">
            <span>{interest}</span>
            {state.resumeEditingMode && (
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditInterestStart(index, interest)}
                  className="text-blue-500 hover:text-blue-700 text-xs"
                  title="Edit"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleRemoveInterest(index)}
                  className="text-red-500 hover:text-red-700 text-xs"
                  title="Remove"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inline editing for interests */}
      {state.resumeEditingMode && editingIndex !== null && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditInterestSave();
              if (e.key === "Escape") handleEditInterestCancel();
            }}
            className="flex-1 border border-blue-500 rounded px-2 py-1 text-sm"
            placeholder="Edit interest..."
            autoFocus
          />
          <button
            onClick={handleEditInterestSave}
            className="text-green-600 hover:text-green-800 text-xs px-2"
          >
            ✓
          </button>
          <button
            onClick={handleEditInterestCancel}
            className="text-red-600 hover:text-red-800 text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal for adding new interests */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Add New Interest"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest
            </label>
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
              placeholder="e.g., Photography, Hiking, Tech Meetups"
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
              onClick={handleAddInterest}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Interest
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterestSection;
