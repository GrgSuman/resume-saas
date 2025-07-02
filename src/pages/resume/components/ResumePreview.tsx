import TemplateOne from "../templates/TemplateOne";
import TemplateTwo from "../templates/TemplateTwo";
import TemplateThree from "../templates/TemplateThree";
import { useResume } from "../../../hooks/useResume";
import { TEMPLATES } from "../../../lib/constants";

const RESUME_WIDTH = 800; // px, adjust as needed

const ResumePreview = ({ resumeRef }: { resumeRef: React.RefObject<HTMLDivElement | null> }) => {
  const { state } = useResume();

  return (
    <div className="flex flex-col h-full">
      {/* Responsive Resume Preview */}
      <div
        className="flex-1 flex bg-gray-50 overflow-auto px-0 sm:px-2 py-4 h-full min-h-0"
      >
        <div
          ref={resumeRef}
          className="mx-auto"
          style={{
            width: RESUME_WIDTH,
            minWidth: RESUME_WIDTH,
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {state.isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              {state?.resumeSettings?.template === TEMPLATES.CREATIVE && <TemplateOne ref={resumeRef} />}
              {state?.resumeSettings?.template === TEMPLATES.PROFESSIONAL && <TemplateTwo ref={resumeRef} />}
              {state?.resumeSettings?.template === TEMPLATES.TWO_COLUMN && <TemplateThree ref={resumeRef} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
