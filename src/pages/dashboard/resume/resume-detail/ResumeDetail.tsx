import { useRef, useState, useEffect, useCallback } from "react";
import ResumePreview from "./ResumePreview";
import SettingsNew from "./SettingsNew";
import DownloadingUI from "./DownloadingUI";
import Chat from "./Chat";
import { MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useResume } from "../../../../hooks/useResume";
import LoadingResumeDetail from "./LoadingResumeDetail";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";
import { cn } from "../../../../lib/utils";

const ResumeDetail = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.92);

  const { state } = useResume();
  const htmlRef = useRef<HTMLDivElement>(null);
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------------
  // Zoom Logic
  // ------------------------------------------------------------------

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Calculates zoom based on the width of the container, not just window
  const calculateAutoZoom = useCallback(() => {
    const containerWidth = window.innerWidth - 32;
    const resumeBaseWidth = 794;
    return Math.max(0.35, Math.min(containerWidth / resumeBaseWidth, 1.0));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(calculateAutoZoom());
  }, [calculateAutoZoom]);

  // Recalculate zoom when window resizes OR when chat opens/closes (changing container size)
  useEffect(() => {
    // We set a timeout to allow the CSS transition (300ms) to finish 
    // before measuring the new width
    const timer = setTimeout(() => {
      handleResetZoom();
    }, 350);

    window.addEventListener("resize", handleResetZoom);
    return () => {
      window.removeEventListener("resize", handleResetZoom);
      clearTimeout(timer);
    };
  }, [handleResetZoom, isChatOpen]);

  return (
    <>
      {/* Downloading UI Overlay */}
      {state?.resumeDownloading && <DownloadingUI />}

      {state === null || state.resumeLoading ? (
        <LoadingResumeDetail />
      ) : (
        <>
          {/* Main Layout Container
             Uses 100dvh (Dynamic Viewport Height) for better mobile browser support 
          */}
          <div className="h-[100dvh] flex flex-col xl:flex-row overflow-hidden bg-[#f5f5f5]">
            
            {/* SECTION 1: RESUME PREVIEW
               Desktop: Left side, Flex-1
               Mobile: Top side. Height changes from 100% -> 45% when chat opens.
            */}
            <div 
              className={cn(
                "relative flex flex-col transition-all duration-300 ease-in-out",
                // Desktop styles
                "xl:flex-1 xl:h-auto",
                // Mobile styles: Shrink to 45% if chat is open, else 100%
                isChatOpen ? "h-[45%]" : "h-full"
              )}
            >
              {/* Settings Toolbar */}
              <div className="absolute top-2 left-2 right-2 z-50">
                <SettingsNew
                  htmlRef={htmlRef}
                  zoomLevel={zoomLevel}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onResetZoom={handleResetZoom}
                />
              </div>

              {/* The actual Resume Preview Area */}
              <div 
                ref={resumeContainerRef}
                className="flex-1 overflow-hidden pt-16 flex justify-center bg-[#f5f5f5]"
              >
                <ResumePreview zoomLevel={zoomLevel} />
              </div>

              {/* Floating Chat Button (Mobile Only) - Only visible when Chat is CLOSED */}
              {!isChatOpen && (
                <div className="xl:hidden absolute bottom-6 right-6 z-50">
                   <Button
                    onClick={() => setIsChatOpen(true)}
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg"
                    title="Open AI Chat"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>

            {/* SECTION 2: CHAT AREA
               Desktop: Right side, Fixed width 420px
               Mobile: Bottom side. Height changes from 0 -> 55% when open.
            */}
            <div 
              className={cn(
                "flex flex-col bg-white z-40 transition-all duration-300 ease-in-out overflow-hidden",
                "xl:w-[420px] xl:h-full", 
                isChatOpen ? "h-[55%] border-t border-gray-200" : "h-0"
              )}
            >
              <div className="xl:hidden flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                <div
                  className="flex-1 flex justify-center"
                  onClick={() => setIsChatOpen(false)}
                >
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-200 transition-colors" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => setIsChatOpen(false)}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <Chat />
              </div>
            </div>


            {/* Hidden Print Section - Required for PDF Generation */}
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