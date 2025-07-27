import { useRef, useState } from "react";
import EditorHeader from "./EditorHeader";
import ResumePreview from "./components/ResumePreview";
import Chat from "./components/Chat";
import SectionsModal from "./components/SectionsModal";
import { ResumeProvider } from "../../context/resume/ResumeContext";

const ResumeDetail = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'chat'>('resume');
  const [sectionsModalOpen, setSectionsModalOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement | null>(null);

  return (
    <ResumeProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <EditorHeader 
          resumeRef={resumeRef} 
          onSectionsClick={() => setSectionsModalOpen(true)}/>

        {/* Mobile Tabs */}
        <div className="xl:hidden border-b border-gray-200 bg-white">
          <div className="flex">
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'resume'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resume Preview
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className={`transform-gpu bg-gray-100 p-5 grow overflow-auto ${activeTab === 'resume' ? 'block' : 'hidden lg:block'}`}>
            <ResumePreview resumeRef={resumeRef} />
          </div>
          
          {/* Desktop Chat - always visible on xl screens */}
          <div className="h-full overflow-y-auto w-[30%] hidden xl:block border-l border-gray-200">
            <Chat />
          </div>

          {/* Mobile Chat - only visible when chat tab is active */}
          <div className={`lg:hidden w-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
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