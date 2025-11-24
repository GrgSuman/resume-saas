import { useRef, useState, useEffect } from "react";
import ResumePreview from "./ResumePreview";
import SettingsNew from "./SettingsNew";
import DownloadingUI from "./DownloadingUI";
import Chat from "./Chat";
import {MessageSquare,X} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useResume } from "../../../../hooks/useResume";
import LoadingResumeDetail from "./LoadingResumeDetail";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";

const ResumeDetail = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.92);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { state } = useResume();
  const htmlRef = useRef<HTMLDivElement>(null);

  // Auto-calculate zoom based on screen size
  const calculateAutoZoom = () => {
    if (!containerRef.current) return null;

    const container = containerRef.current;
    // Account for padding (px-4 = 16px on each side = 32px total)
    const containerWidth = container.clientWidth - 32;

    // A4 dimensions in pixels (210mm = 794px at 96 DPI)
    const resumeWidth = 794;

    // Calculate zoom based on width only, max 100%, min 50%
    const zoomX = containerWidth / resumeWidth;
    const calculatedZoom = Math.max(0.5, Math.min(zoomX, 1.0));

    return calculatedZoom;
  };

  useEffect(() => {
    // Use a debounced resize handler to avoid too many calculations
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const calculatedZoom = calculateAutoZoom();
        if (calculatedZoom !== null) {
          setZoomLevel(calculatedZoom);
        }
      }, 150); // Debounce resize events
    };

    // Initial calculation after a short delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      const calculatedZoom = calculateAutoZoom();
      if (calculatedZoom !== null) {
        setZoomLevel(calculatedZoom);
      }
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    const resetZoom = calculateAutoZoom() || 0.92;
    setZoomLevel(resetZoom);
  };
  return (
    <>
      {/* Downloading UI Overlay */}
      {state?.resumeDownloading && <DownloadingUI />}
      
      {state === null || state.resumeLoading ? (
        <LoadingResumeDetail />
      ) : (
        <>
          <div className="h-screen flex flex-col xl:flex-row overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden xl:flex w-full relative">
              <div className="flex-1 bg-[#f5f5f5] overflow-hidden relative flex flex-col" ref={containerRef}>
                <div className="absolute top-2 left-2 right-2 z-50">
                  <SettingsNew
                    htmlRef={htmlRef}
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onResetZoom={handleResetZoom}
                  />
                </div>
                <div className="flex-1 overflow-hidden pt-16">
                  <ResumePreview zoomLevel={zoomLevel} />
                </div>
              </div>

              <div className="w-[420px] flex overflow-hidden flex-col shadow-xl">
                <Chat />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="xl:hidden flex flex-col h-full relative">
              {/* Preview - Always Visible */}
              <div className="flex-1 overflow-hidden bg-[#f5f5f5] flex flex-col" ref={containerRef}>
                <div className="absolute top-2 left-2 right-2 z-50">
                  <SettingsNew
                    htmlRef={htmlRef}
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onResetZoom={handleResetZoom}
                  />
                </div>
                <div className="flex-1 overflow-hidden pt-16">
                  <ResumePreview zoomLevel={zoomLevel} />
                </div>
              </div>

              {/* Chat FAB */}
              <Button
                onClick={() => setIsChatOpen(true)}
                size="icon"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                title="Chat"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>


              {/* Settings Drawer */}
              {isSettingsOpen && (
                <div className="fixed inset-0 z-[99] flex items-stretch">
                  {/* Backdrop */}
                  <div 
                    className="flex-1 bg-black/50"
                    onClick={() => setIsSettingsOpen(false)}
                  />
                  {/* Drawer */}
                  <div className="w-full sm:w-[400px] bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="text-lg font-semibold">Settings</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Drawer */}
              {isChatOpen && (
                <div className="fixed inset-0 z-[9999] flex items-stretch">
                  {/* Backdrop */}
                  <div 
                    className="flex-1 bg-black/50"
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
