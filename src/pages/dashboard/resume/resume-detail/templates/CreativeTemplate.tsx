import type { ResumeData, ResumeSettings } from "../../../types/resume";
import { ResumeSectionKey } from "../../../types/constants";
import { useResume } from "../../../../../hooks/useResume";
import { Button } from "../../../../../components/ui/button";

const CreativeTemplate = ({
  resumeData,
  resumeSettings,
  openForms,
}: {
  resumeData: ResumeData;
  resumeSettings: ResumeSettings;
  openForms: (
    sectionKey: (typeof ResumeSectionKey)[keyof typeof ResumeSectionKey]
  ) => void;
}) => {
  const data = resumeData;
  const settings = resumeSettings;
  const { state } = useResume();

  // Header style: Text on left, Edit button on right, Line underneath
  const SectionHeader = ({
    label,
    sectionKey,
  }: {
    label: string | undefined;
    sectionKey: string;
  }) => (
    <div className="mt-5 mb-2">
      <div className="flex items-center justify-between border-b border-gray-300 pb-0.5">
        <h2 className="font-bold text-[12pt] text-gray-900 uppercase tracking-wide">
          {label}
        </h2>
        {state.resumeEditingMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openForms(sectionKey)}
            className="h-6 px-2 text-[10px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200"
          >
            Edit {label}
          </Button>
        )}
      </div>
    </div>
  );

  const renderPersonalInfo = () => {
    const contactInfo = [];
    if (data.personalInfo.address) contactInfo.push(data.personalInfo.address);
    if (data.personalInfo.email) contactInfo.push(data.personalInfo.email);
    if (data.personalInfo.phone) contactInfo.push(data.personalInfo.phone);
    if (data.personalInfo.linkedin) contactInfo.push("LinkedIn");
    if (data.personalInfo.github) contactInfo.push("GitHub");

    return (
      <div className="text-center mb-6">
        {state.resumeEditingMode && (
          <div className="flex justify-end mb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openForms(ResumeSectionKey.PERSONAL_INFO)}
              className="h-6 text-[10px] border-blue-200 text-blue-600"
            >
              Edit Header & Summary
            </Button>
          </div>
        )}
        <h1 className="text-[26pt] font-serif text-gray-900 leading-tight mb-1">
          {data.personalInfo.name}
        </h1>
        <div className="text-[10pt] text-gray-700 flex justify-center items-center gap-2">
          {contactInfo.map((item, index) => (
            <span key={index} className="flex items-center">
              {item}
              {index < contactInfo.length - 1 && (
                <span className="mx-2 text-gray-400 font-light">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Summary appears right under Personal Info, like Section 1 in your image */}
        <div className="text-left">
          <SectionHeader 
            label={settings.sections.find(s => s.key === ResumeSectionKey.PERSONAL_INFO)?.label || "Professional Summary"}
            sectionKey={ResumeSectionKey.PERSONAL_INFO}
          />
          <p className="text-[10.5pt] leading-snug text-gray-800">
            {data.personalInfo.summary}
          </p>
        </div>
      </div>
    );
  };

  const renderSkills = () => (
    <div className="mb-4">
      <SectionHeader
        label={settings.sections.find((s) => s.key === "skills")?.label}
        sectionKey="skills"
      />
      <div className="space-y-1">
        {data.skills?.map((skillGroup, index) => (
          <div key={index} className="text-[10.5pt] leading-tight">
            <span className="font-bold text-gray-900">• {skillGroup.categoryName}: </span>
            <span className="text-gray-800">
              {skillGroup.items.map((item) => item.content).join(", ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-4">
      <SectionHeader
        label={settings.sections.find((s) => s.key === "experience")?.label}
        sectionKey="experience"
      />
      <div className="space-y-4">
        {data.experience.map((job, index) => (
          <div key={index} className="text-[10.5pt]">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{job.company}</h3>
              <span className="text-gray-800 font-medium">{job.dateRange}</span>
            </div>
            <div className="flex justify-between items-baseline italic text-gray-700 mb-1">
              <span>{job.role}</span>
              {job.location && <span className="not-italic text-[9.5pt] text-gray-600">{job.location}</span>}
            </div>
            <ul className="list-disc ml-5 space-y-0.5">
              {job.achievements?.map((achievement, idx) => (
                <li key={idx} className="text-gray-800 leading-normal pl-1">
                  {achievement.content}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="mb-4">
      <SectionHeader
        label={settings.sections.find((s) => s.key === "education")?.label}
        sectionKey="education"
      />
      {data.education?.map((edu, index) => (
        <div key={index} className="text-[10.5pt] mb-3">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-gray-900">{edu.institution}</h3>
            <span className="text-gray-800 font-medium">{edu.dateRange}</span>
          </div>
          <div className="flex justify-between items-baseline italic text-gray-700">
            <span>{edu.degree}</span>
            {edu.grade && <span className="not-italic font-medium">GPA: {edu.grade}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white text-black font-sans p-8 md:p-12 print:p-0 print:border-0">
      {settings.sections
        ?.slice()
        .sort((a, b) => a.order - b.order)
        .map((section, index) => {
          if (!section.visible) return null;
          switch (section.key) {
            case ResumeSectionKey.PERSONAL_INFO: return <div key={index}>{renderPersonalInfo()}</div>;
            case ResumeSectionKey.EXPERIENCE: return <div key={index}>{renderExperience()}</div>;
            case ResumeSectionKey.EDUCATION: return <div key={index}>{renderEducation()}</div>;
            case ResumeSectionKey.SKILLS: return <div key={index}>{renderSkills()}</div>;
            case ResumeSectionKey.PROJECTS:
              return (
                <div key={index} className="mb-4">
                  <SectionHeader label="Projects" sectionKey="projects" />
                  {data.projects?.map((p, i) => (
                    <div key={i} className="mb-4 text-[10.5pt]">
                       <div className="flex justify-between items-baseline">
                         <span className="font-bold text-gray-900">{p.name}</span>
                       </div>
                       <ul className="list-disc ml-5 mt-1 space-y-0.5">
                         {p.achievements?.map((a, ai) => <li key={ai} className="text-gray-800">{a.content}</li>)}
                       </ul>
                    </div>
                  ))}
                </div>
              );
            default: return null;
          }
        })}
    </div>
  );
};

export default CreativeTemplate;