import ProfessionalTemplate from './ProfessionalTemplate';
import type { ResumeData, ResumeSettings } from '../../types/resume';
import ModernTemplate from './ModernTemplate';
// import CreativeTemplate from './CreativeTemplate';

// Define template props interface
export interface TemplateProps {
  resumeData: ResumeData; 
  resumeSettings: ResumeSettings;
  openForms: (key: string) => void;
  templateName: string;
}

// Template registry mapping template names to components
const TEMPLATE_REGISTRY = ({resumeData, resumeSettings, openForms, templateName}: TemplateProps) => {
  switch (templateName) {
    case 'professional':
      return <ProfessionalTemplate resumeData={resumeData} resumeSettings={resumeSettings} openForms={openForms} />
    case 'modern':
      return <ModernTemplate resumeData={resumeData} resumeSettings={resumeSettings} openForms={openForms} />
    default:
      return <ProfessionalTemplate resumeData={resumeData} resumeSettings={resumeSettings} openForms={openForms} />
  }
}
export default TEMPLATE_REGISTRY;