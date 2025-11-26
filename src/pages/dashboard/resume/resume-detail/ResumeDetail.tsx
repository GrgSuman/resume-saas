import { useRef, useState, useEffect, useCallback } from "react";
import ResumePreview from "./ResumePreview";
import SettingsNew from "./SettingsNew";
import DownloadingUI from "./DownloadingUI";
import Chat from "./Chat";
import { useResume } from "../../../../hooks/useResume";
import LoadingResumeDetail from "./LoadingResumeDetail";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";
import { Sheet } from "react-modal-sheet";

/* --------------------------------------------
   Main Component
---------------------------------------------*/
const ResumeDetail = () => {
  const [zoomLevel, setZoomLevel] = useState(0.92);
  const [isOpen, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { state } = useResume();
  const htmlRef = useRef<HTMLDivElement>(null);

  /* --------------------------------------------
     Detect Mobile (below XL)
  ---------------------------------------------*/
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* --------------------------------------------
     Zoom logic
  ---------------------------------------------*/

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const calculateAutoZoom = useCallback(() => {
    const containerWidth = window.innerWidth - 32;
    const resumeBaseWidth = 794;
    return Math.max(0.35, Math.min(containerWidth / resumeBaseWidth, 1.0));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(calculateAutoZoom());
  }, [calculateAutoZoom]);

  useEffect(() => {
    handleResetZoom();
    window.addEventListener("resize", handleResetZoom);
    return () => {
      window.removeEventListener("resize", handleResetZoom);
    };
  }, [handleResetZoom]);

  /* --------------------------------------------
     Render
  ---------------------------------------------*/

  return (
    <>
      {state?.resumeDownloading && <DownloadingUI />}

      {state === null || state.resumeLoading ? (
        <LoadingResumeDetail />
      ) : (
        <div className="h-[100vh] flex flex-col xl:flex-row overflow-hidden bg-[#f5f5f5]">
          {/* LEFT: Resume Preview */}
          <div className="relative flex flex-col flex-[2.5] min-h-0 transition-all duration-300 ease-in-out">
            {/* Settings Toolbar */}
            <div className="absolute top-2 left-2 right-2 z-20">
              <SettingsNew
                htmlRef={htmlRef}
                zoomLevel={zoomLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
              />
            </div>

            {/* Preview */}
            <div className="flex-1 overflow-hidden pt-16 flex justify-center bg-[#f5f5f5]">
              <ResumePreview zoomLevel={zoomLevel} />
            </div>
          </div>

          {/* RIGHT: Chat only on XL */}
          {!isMobile && (
            <div className="flex-1 border-l border-gray-200">
              <Chat />
            </div>
          )}

          {/* MOBILE: Floating action button */}
          {isMobile && (
            <div
              onClick={() => setOpen(true)}
              className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md px-4 py-2.5 flex flex-col items-center justify-center border-t border-gray-200/60 z-40 cursor-pointer active:scale-[0.98] transition-all duration-200"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mb-2" />

              {/* Text label with subtle animation */}
              <p className="text-sm font-medium text-gray-700">
                Resume Assistant
              </p>
            </div>
          )}
          {/* MOBILE BOTTOM SHEET */}
          <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                <Chat />
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop  onTap={() => setOpen(false)}/>
          </Sheet>

          {/* Hidden Print Section */}
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
                templateName={state.resumeSettings?.template ?? "professional"}
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ResumeDetail;
