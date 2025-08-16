import { useResume } from "../../../hooks/useResume";
import { TEMPLATES } from "../../../lib/constants";
import CreativeTemplate from "../templates/CreativeTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import ModernTemplate from "../templates/ModernTemplate";

const ResumePreview = ({
  resumeRef,
}: {
  resumeRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { state } = useResume();

  return (
    <div ref={resumeRef}>
      {state.isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          {state?.resumeSettings?.template === TEMPLATES.CREATIVE && (
            <CreativeTemplate ref={resumeRef} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.PROFESSIONAL && (
            <ProfessionalTemplate ref={resumeRef} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.MODERN && (
            <ModernTemplate ref={resumeRef} />
          )}
        </>
      )}
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
