import { useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { useResume } from "../../../hooks/useResume";
import Forms from "./forms/Forms";
import { ResumeSectionKey } from "../types/constants";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";
import ResumeWritingLoader from "./ResumeWritingLoader";
import { manageLocalStorage } from "../../../lib/localstorage";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";


const ResumePreview = () => {
  const { state,dispatch } = useResume();
  const checkHeightRef = useRef<HTMLDivElement>(null); //checking the height of the page
  const [height, setHeight] = useState(0); //height of the page
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.92); // Default zoom level
  
  const [sectionKey, setSectionKey] = useState<
    (typeof ResumeSectionKey)[keyof typeof ResumeSectionKey]
  >(ResumeSectionKey.PERSONAL_INFO);

  useEffect(() => {
    const fetchResumeData = async () => {
      const jobTitleForResume = manageLocalStorage.get("jobTitleForResume");

      if (!jobTitleForResume) {
        setShowSkeleton(false);
        return;
      }
  
      setShowSkeleton(true);

      try {
        const response = await axiosInstance.post("/resumegpt/generate-sample-resume", {
          jobTitle: jobTitleForResume,
        });
        
        dispatch({
          type: "UPDATE_RESUME_SETTINGS",
          payload: response.data.resumeSettings
        });
        
        dispatch({
          type: "UPDATE_RESUME_DATA",
          payload: response.data.resumeData
        });

        manageLocalStorage.remove("jobTitleForResume");
      } catch (error) {
        console.error("Error generating resume:", error);
      } finally {
        setShowSkeleton(false);
      }
    };
    fetchResumeData();
  }, [dispatch]);

  useEffect(() => {
    checkHeight();
  }, [checkHeightRef.current?.clientHeight]);

  const checkHeight = () => {
    if (checkHeightRef.current) {
      setHeight(checkHeightRef.current.clientHeight);
    }
  };

  // Calculate how many page breaks we need (account for viewer padding)
  const viewerPadding = 45;
  const pageHeightInViewer = 1123 + viewerPadding * 2;
  const numberOfBreaks = Math.floor(height / pageHeightInViewer);
  const pageBreaks = [];

  // Create page break elements
  for (let i = 1; i <= numberOfBreaks; i++) {
    // Each break occurs every A4_HEIGHT plus any viewer padding,
    // with an initial offset equal to that padding
    const breakPosition = i * pageHeightInViewer;

    pageBreaks.push(
      <div
        key={`break-${i}`}
        className="absolute left-0 right-0 flex items-center min-w-[794px] justify-center"
        style={{
          top: `${breakPosition}px`,
          height: "20px",
          zIndex: 10,
        }}
      >
        <div className="flex items-center w-full">
          <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider mr-4">
            Page Break {i}
          </span>
          <div
            className="flex-1 border-t border-dashed border-muted-foreground"
            style={{ height: "1px" }}
          />
        </div>
      </div>
    );
  }

  const openForms = (
    key: (typeof ResumeSectionKey)[keyof typeof ResumeSectionKey]
  ) => {
    setSectionKey(key);
    setIsFormsOpen(true);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(0.92);
  };


  return (
    <>
      {showSkeleton ? (
        <ResumeWritingLoader />
      ) : (
        <div className="relative w-full h-full">
          {/* Zoom Controls */}
          <div className="absolute top-2 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="h-8 w-8"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.0}
              className="h-8 w-8"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetZoom}
              className="h-8 w-8"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="w-full h-full">
            <div className="flex justify-center items-center px-4 py-2">
              <div
                className={`bg-background
             transition-all ${
               state.resumeEditingMode
                 ? "ring-2 ring-primary ring-opacity-40 shadow-lg"
                 : ""
             }`}
                style={{
                  minWidth: "210mm",
                  minHeight: "297mm",
                  maxWidth: "210mm",
                  transform: `scale(${zoomLevel})`,
                }}
              >
                <div
                  ref={checkHeightRef}
                  style={{
                    position: "relative",
                    fontSize: `${state.resumeSettings?.fontSize ?? 14}px`,
                    fontFamily: state.resumeSettings?.fontFamily ?? "Lato",
                    padding: "28px",
                    lineHeight: `${state.resumeSettings?.lineHeight ?? "1.4"}em`,
                  }}
                >
                  {!state.resumeEditingMode && pageBreaks}
                  <TEMPLATE_REGISTRY
                    resumeData={state.resumeData}
                    resumeSettings={state.resumeSettings}
                    openForms={openForms}
                    templateName={state.resumeSettings?.template ?? "professional"}
                  />
                </div>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      )}
      <Forms
        isOpen={isFormsOpen}
        onClose={() => setIsFormsOpen(false)}
        sectionKey={sectionKey}
      />
    </>
  );
};

export default ResumePreview;
