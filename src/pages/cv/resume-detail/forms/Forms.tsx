import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Users,
  FileText,
} from "lucide-react";
import PersonalInfoForm from "./PersonalInfoForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import ProjectsForm from "./ProjectsForm";
import CertificationsForm from "./CertificationsForm";
import ReferencesForm from "./ReferencesForm";
import CustomSectionsForm from "./CustomSectionsForm";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";
import { ResumeSectionKey } from "../../types/constants";

interface FormsProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: (typeof ResumeSectionKey)[keyof typeof ResumeSectionKey];
}

const Forms = ({ isOpen, onClose, sectionKey }: FormsProps) => {
  const [activeTab, setActiveTab] = useState(sectionKey);

  useEffect(() => {
    setActiveTab(sectionKey);
  }, [sectionKey]);

  const tabs = [
    { value: ResumeSectionKey.PERSONAL_INFO, label: "Personal", icon: User },
    {
      value: ResumeSectionKey.EXPERIENCE,
      label: "Experience",
      icon: Briefcase,
    },
    {
      value: ResumeSectionKey.EDUCATION,
      label: "Education",
      icon: GraduationCap,
    },
    { value: ResumeSectionKey.SKILLS, label: "Skills", icon: Code },
    { value: ResumeSectionKey.PROJECTS, label: "Projects", icon: FolderGit2 },
    {
      value: ResumeSectionKey.CERTIFICATIONS,
      label: "Certifications",
      icon: Award,
    },
    { value: ResumeSectionKey.REFERENCES, label: "References", icon: Users },
    {
      value: ResumeSectionKey.CUSTOM_SECTIONS,
      label: "Custom",
      icon: FileText,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case ResumeSectionKey.PERSONAL_INFO:
        return <PersonalInfoForm onClose={onClose} />;
      case ResumeSectionKey.EXPERIENCE:
        return <ExperienceForm onClose={onClose} />;
      case ResumeSectionKey.EDUCATION:
        return <EducationForm onClose={onClose} />;
      case ResumeSectionKey.SKILLS:
        return <SkillsForm onClose={onClose} />;
      case ResumeSectionKey.PROJECTS:
        return <ProjectsForm onClose={onClose} />;
      case ResumeSectionKey.CERTIFICATIONS:
        return <CertificationsForm onClose={onClose} />;
      case ResumeSectionKey.REFERENCES:
        return <ReferencesForm onClose={onClose} />;
      case ResumeSectionKey.CUSTOM_SECTIONS:
        return <CustomSectionsForm onClose={onClose} />;
      default:
        return <PersonalInfoForm onClose={onClose} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 h-[95vh] flex flex-col"
        style={{ width: "65vw", maxWidth: "65vw" }}
      >
        <div className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Edit Resume Information
          </DialogTitle>
          <DialogDescription>
            Update your resume details across all sections
          </DialogDescription>
        </div>

        <div className="px-4 py-[3px] border-b bg-muted/50">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max min-w-full h-10 bg-muted p-1 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-sm font-medium whitespace-nowrap px-3 h-8 rounded-sm flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden bg-background">
          <ScrollArea className="h-full">
            <div className="px-6 py-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-0"
                  >
                    {renderTabContent()}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Forms;
