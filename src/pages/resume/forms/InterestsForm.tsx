import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

interface InterestsFormProps {
  isOpen: boolean;
  data: string[];
  onSave: (data: string[]) => void;
  onClose: () => void;
}

const InterestsForm = ({ isOpen, data, onSave, onClose }: InterestsFormProps) => {
  const [interests, setInterests] = useState<string[]>(data || []);
  const [newInterest, setNewInterest] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setInterests(data || []);
  }, [data]);

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleDeleteInterest = (index: number) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    setInterests(updatedInterests);
  };

  const handleEditStart = (index: number, interest: string) => {
    setEditingIndex(index);
    setEditingText(interest);
  };

  const handleEditSave = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updatedInterests = [...interests];
      updatedInterests[editingIndex] = editingText.trim();
      setInterests(updatedInterests);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  const handleFinalSave = () => {
    onSave(interests);
  };

  const handleClose = () => {
    setInterests(data || []);
    setNewInterest("");
    setEditingIndex(null);
    setEditingText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 font-sans"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fade-in font-sans">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white font-sans">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 font-sans">Manage Interests</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-200 font-sans"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-slate-50 px-6 py-6 overflow-y-auto flex-1 font-sans">
          <div className="space-y-6">
            {/* Add New Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add New Interest</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={e => setNewInterest(e.target.value)}
                  placeholder="e.g., Photography, Hiking, Reading"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                />
                <button
                  onClick={handleAddInterest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Interests List */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Current Interests</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {interests.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No interests added yet</div>
                ) : (
                  interests.map((interest, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        {editingIndex === index ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingText}
                              onChange={e => setEditingText(e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              onClick={handleEditSave}
                              className="text-green-600 hover:text-green-800 text-xs px-2 py-1"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="text-gray-600 hover:text-gray-800 text-xs px-2 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1">{interest}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditStart(index, interest)}
                                className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteInterest(index)}
                                className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
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
            Save Changes
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

export default InterestsForm;
