import React, { useEffect, useRef, useState } from "react";
import { A4_WIDTH, TEMPLATES } from "../../../lib/constants";
import { A4_HEIGHT } from "../../../lib/constants";
import type {
  Reference,
  Certification,
  Education,
  Project,
  Experience,
  PersonalInfo,
  ResumeSettings,
  SkillCategory,
  CustomSection,
} from "../../../types/resumeDataType";

// Form imports
import PersonalInfoForm from "../forms/PersonalInfoForm";
import ExperienceForm from "../forms/ExperienceForm";
import EducationForm from "../forms/EducationForm";
import ProjectsForm from "../forms/ProjectsForm";
import SkillsForm from "../forms/SkillsForm";
import CertificationsForm from "../forms/CertificationsForm";
import ReferencesForm from "../forms/ReferencesForm";
import InterestsForm from "../forms/InterestsForm";
import CustomSectionForm from "../forms/CustomSectionForm";
import { useResume } from "../../../hooks/useResume";

const PRINT_PADDING = 28;

const PageWrapper = ({
  children,
  resumeSettings,
  htmlRef,
  activeForm,
  formData,
  setActiveForm,
  setFormData,
}: {
  children: React.ReactNode;
  resumeSettings: ResumeSettings;
  htmlRef: React.RefObject<HTMLDivElement>;
  activeForm: string | null;
  formData:
    | PersonalInfo
    | Education[]
    | Experience[]
    | Project[]
    | SkillCategory[]
    | Certification[]
    | Reference[]
    | string[]
    | CustomSection[]
    | null;
  setActiveForm: (formType: string | null) => void;
  setFormData: (
    data:
      | PersonalInfo
      | Education[]
      | Experience[]
      | Project[]
      | SkillCategory[]
      | Certification[]
      | Reference[]
      | string[]
      | CustomSection[]
      | null
  ) => void;
}) => {
  const checkHeightRef = useRef<HTMLDivElement>(null); //checking the height of the page
  const [height, setHeight] = useState(0); //height of the page
  const { state, dispatch } = useResume(); //dispatching the data to the resume data

  useEffect(() => {
    checkHeight();
  }, [checkHeightRef.current?.clientHeight, dispatch]);

  const checkHeight = () => {
    if (checkHeightRef.current) {
      setHeight(checkHeightRef.current.clientHeight);
    }
  };

  // Calculate how many page breaks we need (account for viewer padding)
  const viewerPadding = state.resumeSettings?.template === TEMPLATES.EXECUTIVE ? 0 : PRINT_PADDING;
  const pageHeightInViewer = A4_HEIGHT + viewerPadding*2
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
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-4">
            Page Break
          </span>
          <div
            className="flex-1 border-t border-dashed border-gray-400"
            style={{ height: "1px" }}
          />
        </div>
      </div>
    );
  }

  const closeForm = () => {
    setActiveForm(null);
    setFormData(null);
  };

  const handleSave = (
    formType: string,
    data:
      | PersonalInfo
      | Education[]
      | Experience[]
      | Project[]
      | SkillCategory[]
      | Certification[]
      | Reference[]
      | string[]
      | CustomSection[]
  ) => {
    dispatch({ type: "UPDATE_RESUME_DATA", payload: { [formType]: data } });
    closeForm();
  };

  return (
    <>
      <div className="relative" ref={checkHeightRef}>
        {/* Visible section for user */}
        <section
          style={{
            minHeight: `${A4_HEIGHT}px`,
            maxWidth: `${A4_WIDTH}px`,
            minWidth: `${A4_WIDTH}px`,
            backgroundColor: "white",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              minHeight: `${A4_HEIGHT}px`,
              color: "black",
              backgroundColor: "white",
              padding: `${state.resumeSettings?.template === TEMPLATES.EXECUTIVE ? 0 : PRINT_PADDING}px`,
              fontSize: `${resumeSettings?.fontSize}px`,
              boxSizing: "border-box",
              fontFamily: resumeSettings?.fontFamily,
              lineHeight: resumeSettings?.lineHeight,
            }}
          >
            {children}
          </div>
        </section>

        {!state.resumeEditingMode && pageBreaks}

        {/* Hidden section for printing */}
        <section ref={htmlRef} className="hidden">
          <div
            style={{
              maxWidth: `${A4_WIDTH}px`,
              minWidth: `${A4_WIDTH}px`,
              minHeight: `${A4_HEIGHT}px`,
              color: "black",
              backgroundColor: "white",
              fontSize: `${resumeSettings?.fontSize}px`,
              boxSizing: "border-box",
              fontFamily: resumeSettings?.fontFamily,
              lineHeight: resumeSettings?.lineHeight,
            }}
          >
            {children}
          </div>
        </section>
      </div>

      {/* Form Modals */}
      {activeForm === "personalInfo" && (
        <PersonalInfoForm
          isOpen={true}
          data={formData as PersonalInfo}
          onSave={(data) => handleSave("personalInfo", data as PersonalInfo)}
          onClose={closeForm}
        />
      )}

      {activeForm === "experience" && (
        <ExperienceForm
          isOpen={true}
          data={formData as Experience[]}
          onSave={(data) => handleSave("experience", data as Experience[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "education" && (
        <EducationForm
          isOpen={true}
          data={formData as Education[]}
          onSave={(data) => handleSave("education", data as Education[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "projects" && (
        <ProjectsForm
          isOpen={true}
          data={formData as Project[]}
          onSave={(data) => handleSave("projects", data as Project[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "skills" && (
        <SkillsForm
          isOpen={true}
          data={formData as SkillCategory[]}
          onSave={(data) => handleSave("skills", data as SkillCategory[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "certifications" && (
        <CertificationsForm
          isOpen={true}
          data={formData as Certification[]}
          onSave={(data) =>
            handleSave("certifications", data as Certification[])
          }
          onClose={closeForm}
        />
      )}

      {activeForm === "references" && (
        <ReferencesForm
          isOpen={true}
          data={formData as Reference[]}
          onSave={(data) => handleSave("references", data as Reference[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "interests" && (
        <InterestsForm
          isOpen={true}
          data={formData as string[]}
          onSave={(data) => handleSave("interests", data as string[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "customSections" && (
        <CustomSectionForm
          isOpen={true}
          data={formData as CustomSection[]}
          onSave={(data) =>
            handleSave("customSections", data as CustomSection[])
          }
          onClose={closeForm}
        />
      )}
    </>
  );
};

export default PageWrapper;
