import { useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { useResume } from "../../../hooks/useResume";
import Forms from "./forms/Forms";
import { ResumeSectionKey } from "../types/constants";
import TEMPLATE_REGISTRY from "./templates/TemplateRegistry";


const ResumePreview = ({
  htmlRef,
}: {
  htmlRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { state } = useResume();
  const checkHeightRef = useRef<HTMLDivElement>(null); //checking the height of the page
  const [height, setHeight] = useState(0); //height of the page
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const [sectionKey, setSectionKey] = useState<
    (typeof ResumeSectionKey)[keyof typeof ResumeSectionKey]
  >(ResumeSectionKey.PERSONAL_INFO);

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

  return (
    <>
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
              transform: "scale(0.92)",
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
      <Forms
        isOpen={isFormsOpen}
        onClose={() => setIsFormsOpen(false)}
        sectionKey={sectionKey}
      />

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
            openForms={openForms}
            templateName={state.resumeSettings?.template ?? "professional"}
          />
        </div>
      </section>
    </>
  );
};

export default ResumePreview;
