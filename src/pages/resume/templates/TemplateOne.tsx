import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ProjectsSection from "./sections/ProjectSection";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SkillsSection from "./sections/SkillsSection";
import CertificationSection from "./sections/CertificationSection";
import ReferenceSection from "./sections/ReferenceSection";
import InterestSection from "./sections/InterestSection";
import CustomSection from "./sections/CustomSection";
import { useResume } from "../../../hooks/useResume";

const ResumeTemplate = ({ref}:{ref:React.RefObject<HTMLDivElement | null>}) => {

  const {state} = useResume()
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

  return (
    <div
      ref={ref}
      className="max-w-[210mm] min-w-[210mm]  min-h-[297mm] max-h-[297mm]"
    >
      <div
        className="max-w-[210mm] min-w-[210mm]  min-h-[297mm] max-h-[297mm] mx-auto bg-white text-black leading-tight font-serif p-6 py-8 overflow-hidden"
        style={{ fontSize: `${state.resumeSettings.fontSize}px`, boxSizing: "border-box", fontFamily: state.resumeSettings.fontFamily }}
      >
      {state.resumeSettings.sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((x,index)=>{
          if(x.visible){
            switch(x.key){
              case "personalInfo":
                return <PersonalInfoSection key={index} personalInfo={personalInfo} />
              case "experience":
                return <ExperienceSection key={index} experience={experience} />
              case "education":
                return <EducationSection key={index} education={education} />
              case "projects":
                return <ProjectsSection key={index} projects={projects || []} />
              case "skills":
                return <SkillsSection key={index} skills={skills || []} />
              case "certifications":
                return <CertificationSection key={index} certifications={certifications || []}/>
              case "references":
                return <ReferenceSection key={index} references={references || []} />
              case "interests":
                return <InterestSection key={index} interests={interests || []} />
              case "customSections":
                return <CustomSection key={index} customSections={customSections || []}/>
              default:
                return null
            }
          }
        })}
      </div>
    </div>
  );
};

export default ResumeTemplate;
