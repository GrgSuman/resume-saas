import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ProjectsSection from "./sections/ProjectSection";
import SkillsSection from "./sections/SkillsSection";
import CertificationSection from "./sections/CertificationSection";
import ReferenceSection from "./sections/ReferenceSection";
import InterestSection from "./sections/InterestSection";
import CustomSection from "./sections/CustomSection";
import { useResume } from "../../../hooks/useResume";
import PersonalInfoSection from "./sections/PersonalInfoSection";

const TemplateThree = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => {
  const { state } = useResume();
  if(!state.resumeData) return null;
  const {
    personalInfo,
    education,
    experience,
    projects,
    skills,
    certifications,
    references,
    interests,
    customSections,
  } = state.resumeData;

  // Sort sections by order
  const sortedSections = state?.resumeSettings?.sections?.slice()
    .sort((a, b) => a.order - b.order)
    .filter(x => x.visible);

  const renderSection = (section: any, index: number) => {
    const baseProps = { key: index };
    
    switch (section.key) {
      case "personalInfo":
        return <PersonalInfoSection {...baseProps} personalInfo={personalInfo || {}} />;
      case "experience":
        return <ExperienceSection {...baseProps} experience={experience || []} />;
      case "education":
        return <EducationSection {...baseProps} education={education || []} />;
      case "projects":
        return <ProjectsSection {...baseProps} projects={projects || []} />;
      case "skills":
        return <SkillsSection {...baseProps} skills={skills || []} />;
      case "certifications":
        return <CertificationSection {...baseProps} certifications={certifications || []} />;
      case "references":
        return <ReferenceSection {...baseProps} references={references || []} />;
      case "interests":
        return <InterestSection {...baseProps} interests={interests || []} />;
      case "customSections":
        return <CustomSection {...baseProps} customSections={customSections || []} />;
      default:
        return null;
    }
  };

  // Split sections into left and right columns after personal info
  const personalInfoSection = sortedSections?.find(s => s.key === "personalInfo");
  const otherSections = sortedSections?.filter(s => s.key !== "personalInfo");
  
  // Define which sections go in left vs right column
  const leftColumnSections = otherSections?.filter(s => 
    ['experience', 'projects', 'customSections'].includes(s.key)
  );
  
  const rightColumnSections = otherSections?.filter(s => 
    ['education', 'skills', 'certifications', 'references', 'interests'].includes(s.key)
  );

  return (
    <div ref={ref}>
      <div
        className="max-w-[210mm] min-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto bg-white text-black leading-tight overflow-hidden"
        style={{ 
          fontSize: `${state.resumeSettings?.fontSize}px`, 
          boxSizing: "border-box",
          padding: "32px 40px",
          fontFamily: state.resumeSettings?.fontFamily
        }}
      >
        {/* Header Section - Personal Info */}
        <div className="mb-6">
          {personalInfoSection && renderSection(personalInfoSection, 0)}
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-6">
            {leftColumnSections?.map((section, index) => (
              <div key={section.key} className="break-inside-avoid">
                {renderSection(section, index + 1)}
              </div>
            ))}
          </div>

          {/* Right Column - Supporting Information */}
          <div className="w-72 space-y-6">
            {rightColumnSections?.map((section, index) => (
              <div key={section.key} className="break-inside-avoid">
                {renderSection(section, index + (leftColumnSections?.length || 0) + 1)}
              </div>
            ))}
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default TemplateThree;