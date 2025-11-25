import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import ResumePreview from "./ResumePreview";
import SettingsNew from "./SettingsNew";
import DownloadingUI from "./DownloadingUI";
import Chat from "./Chat";
import { useResume } from "../../../../hooks/useResume";
import LoadingResumeDetail from "./LoadingResumeDetail";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";

const ResumeDetail = () => {
  const [zoomLevel, setZoomLevel] = useState(0.92);

  const { state } = useResume();
  const htmlRef = useRef<HTMLDivElement>(null);

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

  // Recalculate zoom when window resizes
  useEffect(() => {
    handleResetZoom();
    window.addEventListener("resize", handleResetZoom);
    return () => {
      window.removeEventListener("resize", handleResetZoom);
    };
  }, [handleResetZoom]);

  return (
    <>
      {/* Downloading UI Overlay */}
      {state?.resumeDownloading && <DownloadingUI />}

      {state === null || state.resumeLoading ? (
        <LoadingResumeDetail />
      ) : (
        <>
          {/* Main Layout Container*/}
          <div className="h-[100vh] flex flex-col xl:flex-row overflow-hidden bg-[#f5f5f5]">
            
            {/* SECTION 1: RESUME PREVIEW*/}
            <div className="relative flex flex-col flex-1 min-h-0 transition-all duration-300 ease-in-out">
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

              {/* The actual Resume Preview Area */}
              <div className="flex-1 overflow-hidden pt-16 flex justify-center bg-[#f5f5f5]">
                <ResumePreview zoomLevel={zoomLevel} />
              </div>

            </div>

            {/* SECTION 2: CHAT AREA*/}
            {/* <div className=" bg-white transition-all duration-300 ease-in-out overflow-hidden xl:w-[420px] w-full">
              <Chat />
            </div> */}

            <DraggableBottomSheet>
              <Chat/>
            </DraggableBottomSheet>

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


export function DraggableBottomSheet({ children }: { children: ReactNode }) {
  const [height, setHeight] = useState(70); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDragging || !containerRef.current) return;

      const windowHeight = window.innerHeight;
      const deltaY = startY.current - clientY;
      const deltaPercent = (deltaY / windowHeight) * 100;
      const newHeight = Math.min(
        Math.max(startHeight.current + deltaPercent, 20),
        90
      );

      setHeight(newHeight);
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    // Snap to 50% if close
    if (Math.abs(height - 50) < 10) {
      setHeight(50);
    }
  }, [height]);

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = height;
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (event: MouseEvent) => handleMove(event.clientY);
    const onTouchMove = (event: TouchEvent) =>
      handleMove(event.touches[0].clientY);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [handleEnd, handleMove, isDragging]);

  return (
    <>
      {/* Desktop view (xl and above) - static sidebar */}
      <div className="hidden xl:block xl:w-[420px] w-full h-full bg-white">
        {children}
      </div>

      {/* Mobile/Tablet view (below xl) - draggable bottom sheet */}
      <div
        ref={containerRef}
        className="xl:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-3xl transition-shadow duration-200 z-50"
        style={{ 
          height: `${height}vh`,
          touchAction: 'none'
        }}
      >
        {/* Drag Handle */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Chat Content */}
        <div className="pt-10 h-full w-full overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
}