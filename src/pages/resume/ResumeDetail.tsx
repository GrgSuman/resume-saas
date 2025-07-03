import { useRef, useState } from "react";
import EditorHeader from "./EditorHeader";
import ResumePreview from "./components/ResumePreview";
import Chat from "./components/Chat";
import Settings from "./components/Settings";
import { MessageSquare, Settings as SettingsIcon, X } from "lucide-react";
import { ResumeProvider } from "../../context/resume/ResumeContext";

const ResumeDetail = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "assistant">("assistant");
  const resumeRef = useRef<HTMLDivElement | null>(null);

  return (
    <ResumeProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <EditorHeader resumeRef={resumeRef} />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden h-full min-h-0">
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            {/* Resume Preview */}
            <div className="flex-1 h-full min-h-0 overflow-auto">
              <div
                className="flex-1 justify-center flex bg-gray-50 overflow-auto px-0 sm:px-2 py-4"
              >
                <ResumePreview resumeRef={resumeRef} />
              </div>
            </div>
            {/* Right Side - Tabs/Panel */}
            <div className="w-1/4 min-w-80 border-l bg-white flex flex-col">
              {/* Tab Navigation */}
              <div className="flex border-b bg-gray-50">
                <button
                  onClick={() => setActiveTab("assistant")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "assistant"
                      ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Assistant
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "settings"
                      ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <SettingsIcon className="h-4 w-4" />
                  Resume Settings
                </button>
              </div>
              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === "assistant" && <Chat />}
                {activeTab === "settings" && <Settings />}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden w-full h-full">
            {/* Resume Preview */}
            <div className="flex-1 overflow-auto">
              <div
                className="flex-1 flex bg-gray-50 overflow-auto px-0 sm:px-2 py-4"
              >
                <ResumePreview resumeRef={resumeRef} />
              </div>
            </div>
            {/* Floating Action Button */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setMobileDrawerOpen(true);
                }}
                className="bg-white shadow-lg rounded-full p-3 border hover:bg-teal-50"
                title="Open Resume Settings"
              >
                <SettingsIcon className="h-6 w-6 text-teal-600" />
              </button>
              <button
                onClick={() => {
                  setActiveTab("assistant");
                  setMobileDrawerOpen(true);
                }}
                className="bg-white shadow-lg rounded-full p-3 border hover:bg-teal-50"
                title="Open Assistant"
              >
                <MessageSquare className="h-6 w-6 text-teal-600" />
              </button>
            </div>
            {/* Bottom Drawer */}
            {mobileDrawerOpen && (
              <div className="fixed inset-0 z-50 flex items-end bg-black/30">
                <div className="w-full bg-white rounded-t-2xl shadow-2xl min-h-[80vh] max-h-[80vh] flex flex-col">
                  {/* Drawer Header with Tabs */}
                  <div className="flex items-center border-b px-4">
                    <button
                      className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === "settings" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600"}`}
                      onClick={() => setActiveTab("settings")}
                      style={{ minHeight: 48 }}
                    >
                      Resume Settings
                    </button>
                    <button
                      className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === "assistant" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600"}`}
                      onClick={() => setActiveTab("assistant")}
                      style={{ minHeight: 48 }}
                    >
                      Assistant
                    </button>
                    <button
                      onClick={() => setMobileDrawerOpen(false)}
                      className="ml-2 text-gray-500 hover:text-gray-900 p-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {/* Drawer Content */}
                  <div className="flex-1 overflow-auto  px-4 py-2">
                    {activeTab === "settings" && <Settings />}
                    {activeTab === "assistant" && <Chat />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default ResumeDetail;
