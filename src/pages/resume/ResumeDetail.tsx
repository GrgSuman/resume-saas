import { useRef, useState } from "react";
import EditorHeader from "./EditorHeader";
import ResumePreview from "./components/ResumePreview";
import Chat from "./components/Chat"; // Your existing Chat component
import SectionsModal from "./components/SectionsModal";
import { ResumeProvider } from "../../context/resume/ResumeContext";

const ResumeDetail = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "chat">("resume");
  const [sectionsModalOpen, setSectionsModalOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement | null>(null);

  return (
    <ResumeProvider>
      <div className="flex h-screen flex-col bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20">
          <EditorHeader
            resumeRef={resumeRef}
            onSectionsClick={() => setSectionsModalOpen(true)}
          />
        </div>

        {/* Mobile Tabs - Sticky below header */}
        <div className="xl:hidden sticky top-14 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex">
            <button
              onClick={() => setActiveTab("resume")}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors relative ${
                activeTab === "resume"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-600 after:rounded-t-full"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Resume Preview
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors relative ${
                activeTab === "chat"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-600 after:rounded-t-full"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chat Assistant
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-white">
          {/* Resume Preview - shown on desktop or when mobile tab is active */}
          <div
            className={`flex-1 overflow-auto light-scrollbar bg-gray-50 p-4 md:p-6 ${
              activeTab === "resume" ? "block" : "hidden xl:block"
            }`}
          >
            <ResumePreview resumeRef={resumeRef} />
          </div>

          {/* Chat Panel */}
          <div
            className={`h-full flex flex-col border-t border-gray-200 xl:border-t-0 xl:border-l xl:w-[30%] xl:min-w-[384px] ${
              activeTab === "chat" ? "flex" : "hidden xl:flex"
            }`}
          >
            <Chat />
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