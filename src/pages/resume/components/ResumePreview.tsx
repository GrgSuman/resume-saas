import { useResume } from "../../../hooks/useResume";
import { TEMPLATES } from "../../../lib/constants";

import CreativeTemplate from "../templates/CreativeTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import TwoColumnTemplate from "../templates/TwoColumnTemplate";
import PageWrapper from "./PageWrapper";
import type { ResumeSettings } from "../../../types/resumeDataType";
import CircularLoadingIndicator from "../../../components/sections/CircularLoadingIndicator";
import { useState } from "react";
import type { PersonalInfo, Education, Experience, Project, SkillCategory, Certification, Reference, CustomSection } from "../../../types/resumeDataType";
import MinimalistTemplate from "../templates/MinimalistTemplate";
import ElegantTemplate from "../templates/ElegantTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";

const ResumePreview = ({resumeRef}: {resumeRef: React.RefObject<HTMLDivElement | null>}) => {
  const { state } = useResume();

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [formData, setFormData] = useState<
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
  >(null);


  return (
    <div>
      {state.isLoading ? (
        <CircularLoadingIndicator />
      ) : (
        <>
          <PageWrapper setActiveForm={setActiveForm} setFormData={setFormData} activeForm={activeForm} formData={formData} resumeSettings={state?.resumeSettings as ResumeSettings} htmlRef={resumeRef as React.RefObject<HTMLDivElement>}>
          {state?.resumeSettings?.template === TEMPLATES.CREATIVE && (
            <CreativeTemplate setActiveForm={setActiveForm} setFormData={setFormData} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.PROFESSIONAL && (
            <ProfessionalTemplate setActiveForm={setActiveForm} setFormData={setFormData}/>
          )}
          {state?.resumeSettings?.template === TEMPLATES.MODERN && (
            <ModernTemplate setActiveForm={setActiveForm} setFormData={setFormData} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.TWO_COLUMN && (
            <TwoColumnTemplate setActiveForm={setActiveForm} setFormData={setFormData} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.MINIMALIST && (
            <MinimalistTemplate setActiveForm={setActiveForm} setFormData={setFormData} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.ELEGANT && (
            <ElegantTemplate setActiveForm={setActiveForm} setFormData={setFormData} />
          )}
          {state?.resumeSettings?.template === TEMPLATES.EXECUTIVE && (
            <ExecutiveTemplate setActiveForm={setActiveForm} setFormData={setFormData} />
          )}
          </PageWrapper>
        </>
      )}
    </div>
  );
};

export default ResumePreview;