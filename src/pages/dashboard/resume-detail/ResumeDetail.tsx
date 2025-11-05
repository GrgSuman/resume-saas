import { useRef, useState } from "react";
import Settings from "./Settings";
import ResumePreview from "./ResumePreview";
import Chat from "./Chat";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useResume } from "../../../hooks/useResume";
import LoadingResumeDetail from "./LoadingResumeDetail";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";

const ResumeDetail = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { state } = useResume();
  const htmlRef = useRef<HTMLDivElement>(null);
  return (
    <>
      {state === null || state.resumeLoading ? (
        <LoadingResumeDetail />
      ) : (
        <>
          <div className="h-screen flex flex-col xl:flex-row overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden xl:flex w-full h-full">
              <Settings htmlRef={htmlRef} />

              <div className="flex-1 bg-[#f9f8f7] overflow-hidden relative">
                <ResumePreview/>
              </div>

              <div className="w-96 flex overflow-hidden flex-col shadow-xl">
                <Chat />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="xl:hidden flex flex-col h-full relative">
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

              {/* Preview - Always Visible */}
              <div className="flex-1 overflow-hidden bg-[#f9f8f7]">
                <ResumePreview/>
              </div>

              {/* Floating Action Buttons */}
              <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                {/* Settings FAB */}
                <Button
                  onClick={() => setIsSettingsOpen(true)}
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg"
                  title="Settings"
                >
                  <SettingsIcon className="h-6 w-6" />
                </Button>

                {/* Chat FAB */}
                <Button
                  onClick={() => setIsChatOpen(true)}
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg"
                  title="Chat"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </div>

              {/* Settings Drawer */}
              {isSettingsOpen && (
                <div className="fixed inset-0 z-[9999] flex items-stretch">
                  {/* Backdrop */}
                  <div 
                    className="flex-1 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsSettingsOpen(false)}
                  />
                  {/* Drawer */}
                  <div className="w-full sm:w-[400px] bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    {/* <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="text-lg font-semibold">Settings</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div> */}
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      <Settings htmlRef={htmlRef} />
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Drawer */}
              {isChatOpen && (
                <div className="fixed inset-0 z-[9999] flex items-stretch">
                  {/* Backdrop */}
                  <div 
                    className="flex-1 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsChatOpen(false)}
                  />
                  {/* Drawer */}
                  <div className="w-full sm:w-[400px] bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="text-lg font-semibold">Chat</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsChatOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      <Chat />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden section for printing */}
            <section ref={htmlRef} className="hidden">
              <div
                style={{
                  maxWidth: "210mm",
                  minWidth: "210mm",
                  minHeight: "297mm",
                  backgroundColor: "white",
                  fontSize: `${state.resumeSettings?.fontSize}px`,
                  boxSizing: "border-box",
                  fontFamily: state.resumeSettings?.fontFamily,
                  lineHeight: `${state.resumeSettings?.lineHeight ?? "1.4"}em`,
                }}
              >
                <TEMPLATE_REGISTRY
                  resumeData={state.resumeData}
                  resumeSettings={state.resumeSettings}
                  openForms={() => {}}
                  templateName={
                    state.resumeSettings?.template ?? "professional"
                  }
                />
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default ResumeDetail;
