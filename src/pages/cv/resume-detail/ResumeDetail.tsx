import { useRef, useState } from "react";
import Settings from "./Settings";
import ResumePreview from "./ResumePreview";
import Chat from "./Chat";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useResume } from '../../../hooks/useResume'
import LoadingResumeDetail from "./LoadingResumeDetail";
const ResumeDetail = () => {
  const [activeTab, setActiveTab] = useState<"settings" | "preview" | "chat">(
    "preview"
  );

  const { state } = useResume();
  const htmlRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {state===null || state.resumeLoading ? (
        <LoadingResumeDetail />
      ) : (
        <>
          <div className="h-screen flex flex-col xl:flex-row overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden xl:flex w-full h-full">
              <Settings htmlRef={htmlRef} />

              <div className="flex-1 bg-[#f9f8f7] overflow-hidden relative">
                <ResumePreview htmlRef={htmlRef} />
              </div>

              <div className="w-96 flex overflow-hidden flex-col shadow-xl">
                <Chat />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="xl:hidden flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-white">
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "settings"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "preview"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "chat"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === "settings" && (
                  <div className="h-full">
                    <Settings htmlRef={htmlRef} />
                  </div>
                )}
                {activeTab === "preview" && (
                  <div className="h-full bg-gray-100">
                    <ResumePreview htmlRef={htmlRef} />
                  </div>
                )}
                {activeTab === "chat" && (
                  <div className="h-full">
                    <Chat />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResumeDetail;
