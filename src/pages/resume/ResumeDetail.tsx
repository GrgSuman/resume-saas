import { useRef, useState } from "react";
import EditorHeader from "./EditorHeader";
import ResumePreview from "./components/ResumePreview";
import Chat from "./components/Chat";
import SectionsModal from "./components/SectionsModal";
import { MessageSquare, X } from "lucide-react";
import { ResumeProvider } from "../../context/resume/ResumeContext";

const ResumeDetail = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sectionsModalOpen, setSectionsModalOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement | null>(null);

  return (
    <ResumeProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <EditorHeader 
          resumeRef={resumeRef} 
          onSectionsClick={() => setSectionsModalOpen(true)} 
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden h-full min-h-0">
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            {/* Left Side - Resume Preview */}
            <div className="flex-1 h-full min-h-0">
              {/* Resume Preview */}
              <div className="flex-1 overflow-auto h-full light-scrollbar">
                <div className="flex-1 justify-center flex bg-gray-50 overflow-auto px-0 sm:px-2 py-4">
                  <ResumePreview resumeRef={resumeRef} />
                </div>
              </div>
            </div>

            {/* Right Side - Chat Only */}
            <div className="w-1/4 bg-white">
              <Chat />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden w-full h-full">
            {/* Resume Preview */}
            <div className="flex-1 overflow-auto">
              <div className="flex-1 flex bg-gray-50 overflow-auto px-0 sm:px-2 py-4">
                <ResumePreview resumeRef={resumeRef} />
              </div>
            </div>
            
            {/* Floating Chat Button */}
            <div className="fixed bottom-4 right-4 z-50">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg rounded-full p-4 transition-colors"
                title="Open Assistant"
              >
                <MessageSquare className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile Chat Drawer */}
            {mobileDrawerOpen && (
              <div className="fixed inset-0 z-50 flex items-end bg-black/30">
                <div className="w-full bg-white rounded-t-2xl shadow-2xl min-h-[80vh] max-h-[80vh] flex flex-col">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">AI Assistant</h3>
                    <button
                      onClick={() => setMobileDrawerOpen(false)}
                      className="text-gray-500 hover:text-gray-900 p-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Chat Content */}
                  <div className="flex-1 overflow-hidden">
                    <Chat />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sections Modal */}
        <SectionsModal 
          isOpen={sectionsModalOpen} 
          onClose={() => setSectionsModalOpen(false)} 
        />
      </div>
    </ResumeProvider>
  );
};

export default ResumeDetail;
