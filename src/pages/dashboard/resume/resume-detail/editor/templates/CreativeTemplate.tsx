import type { ResumeData, ResumeSettings } from "../../../../types/resume";
import { ResumeSectionKey } from "../../../../types/constants";
import { useResume } from "../../../../../../hooks/useResume";
import { Button } from "../../../../../../components/ui/button";
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

  const SectionHeader = ({
    label,
    sectionKey,
  }: {
    label: string | undefined;
    sectionKey: string;
  }) => (
    <div className="mt-5 mb-2">
      <div className="flex items-center justify-between border-b border-black pb-0.5">
        <h2 className="font-bold text-[11pt] text-black">
          {label}
        </h2>
        {state.resumeEditingMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openForms(sectionKey)}
            className="h-6 px-2 text-[10px] font-medium text-blue-600 hover:bg-blue-50"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );

  // Helper function to format URL with protocol
  const formatUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const renderPersonalInfo = () => {
    type ContactItem = 
      | { type: "text"; value: string }
      | { type: "link"; label: string; url: string };
    
    const contactInfo: ContactItem[] = [];
    if (data.personalInfo.phone) contactInfo.push({ type: "text", value: data.personalInfo.phone });
    if (data.personalInfo.address) {
      contactInfo.push({ type: "text", value: data.personalInfo.address });
    }
    if (data.personalInfo.email) contactInfo.push({ type: "text", value: data.personalInfo.email });
    if (data.personalInfo.website) {
      contactInfo.push({ type: "link", label: "Website", url: formatUrl(data.personalInfo.website) });
    }
    if (data.personalInfo.linkedin) {
      contactInfo.push({ type: "link", label: "LinkedIn", url: formatUrl(data.personalInfo.linkedin) });
    }
    if (data.personalInfo.github) {
      contactInfo.push({ type: "link", label: "Github", url: formatUrl(data.personalInfo.github) });
    }
    if (data.personalInfo.twitter) {
      contactInfo.push({ type: "link", label: "Twitter", url: formatUrl(data.personalInfo.twitter) });
    }


    return (
      <div className="text-center mb-4">
        {state.resumeEditingMode && (
          <div className="flex justify-end mb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openForms(ResumeSectionKey.PERSONAL_INFO)}
              className="h-6 text-[10px] border-blue-200 text-blue-600"
            >
              Edit Header
            </Button>
          </div>
        )}
        
        <h1 className="text-[20pt] font-bold text-black mb-2">
          {data.personalInfo.name}
        </h1>
        
        <div className="text-[9pt] text-black">
          {contactInfo.map((item, index) => (
            <span key={index}>
              {item.type === "link" ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                item.value
              )}
              {index < contactInfo.length - 1 && " | "}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    const section = settings.sections.find((s) => s.key === ResumeSectionKey.EDUCATION);
    
    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={ResumeSectionKey.EDUCATION} />
        <div className="space-y-3">
          {data.education
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((edu, index) => (
              <div key={index} className="text-[10pt]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{edu.institution}</h3>
                    <div className="italic text-black">
                      {edu.degree}
                      {edu.grade && `, GPA: ${edu.grade}`}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="italic text-black">{edu.dateRange}</div>
                  </div>
                </div>
                {edu.description && (
                  <p className="text-black mt-1">{edu.description}</p>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    const section = settings.sections.find((s) => s.key === ResumeSectionKey.EXPERIENCE);
    
    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={ResumeSectionKey.EXPERIENCE} />
        <div className="space-y-3">
          {data.experience
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((job, index) => (
              <div key={index} className="text-[10pt]">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-black">{job.role}</h3>
                  <span className="text-black ml-4">{job.dateRange}</span>
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="italic text-black">{job.company}</div>
                  {job.location && (
                    <div className="italic text-black ml-4">{job.location}</div>
                  )}
                </div>
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc ml-5 space-y-0.5">
                    {job.achievements
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((achievement, idx) => (
                        <li key={idx} className="text-black leading-normal">
                          {achievement.content}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const section = settings.sections.find((s) => s.key === ResumeSectionKey.PROJECTS);
    
    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={ResumeSectionKey.PROJECTS} />
        <div className="space-y-3">
          {data.projects
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((project, index) => (
              <div key={index} className="text-[10pt]">
                <div className="mb-1">
                  <span className="font-bold text-black">{project.name}</span>
                  {project.link && (
                    <span className="italic text-black"> | {project.link}</span>
                  )}
                </div>
                {project.achievements && project.achievements.length > 0 && (
                  <ul className="list-disc ml-5 space-y-0.5">
                    {project.achievements
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((achievement, idx) => (
                        <li key={idx} className="text-black leading-normal">
                          {achievement.content}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    const section = settings.sections.find((s) => s.key === ResumeSectionKey.SKILLS);
    
    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={ResumeSectionKey.SKILLS} />
        <div className="space-y-1 text-[10pt]">
          {data.skills
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((skillGroup, index) => (
              <div key={index} className="text-black">
                <span className="font-bold">{skillGroup.categoryName ? `${skillGroup.categoryName}: ` : ""}</span>
                <span>
                  {skillGroup.items
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((item) => item.content)
                    .join(", ")}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    const section = settings.sections.find((s) => s.key === ResumeSectionKey.CERTIFICATIONS);
    
    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={ResumeSectionKey.CERTIFICATIONS} />
        <div className="space-y-2 text-[10pt]">
          {data.certifications
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((cert, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-black">{cert.name}</span>
                  {cert.date && (
                    <span className="text-black ml-4">{cert.date}</span>
                  )}
                </div>
                {cert.issuer && (
                  <div className="text-black">{cert.issuer}</div>
                )}
                {cert.description && (
                  <div className="text-black">{cert.description}</div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderReferences = () => {
    const section = settings.sections.find((s) => s.key === ResumeSectionKey.REFERENCES);
    
    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={ResumeSectionKey.REFERENCES} />
        <div className="space-y-2 text-[10pt]">
          {data.references
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((ref, index) => (
              <div key={index}>
                <div className="font-bold text-black">{ref.name}</div>
                {(ref.position || ref.company) && (
                  <div className="text-black">
                    {ref.position}
                    {ref.position && ref.company && " - "}
                    {ref.company}
                  </div>
                )}
                {ref.contact && (
                  <div className="text-black">{ref.contact}</div>
                )}
                {ref.description && (
                  <div className="text-black">{ref.description}</div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderCustomSection = (sectionKey: string) => {
    const section = settings.sections.find((s) => s.key === sectionKey);
    const customSection = data.customSections?.find((cs) => cs.name === section?.label);
    
    if (!customSection) return null;

    return (
      <div>
        <SectionHeader label={section?.label} sectionKey={sectionKey} />
        {customSection.achievements && customSection.achievements.length > 0 && (
          <ul className="list-disc ml-5 space-y-0.5 text-[10pt]">
            {customSection.achievements
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((achievement, idx) => (
                <li key={idx} className="text-black leading-normal">
                  {achievement.content}
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white text-black px-6 py-8 print:px-6 print:py-8">
      {renderPersonalInfo()}
      
      {settings.sections
        ?.slice()
        .sort((a, b) => a.order - b.order)
        .map((section, index) => {
          if (!section.visible || section.key === ResumeSectionKey.PERSONAL_INFO) return null;
          
          switch (section.key) {
            case ResumeSectionKey.EDUCATION:
              return <div key={index}>{renderEducation()}</div>;
            case ResumeSectionKey.EXPERIENCE:
              return <div key={index}>{renderExperience()}</div>;
            case ResumeSectionKey.PROJECTS:
              return <div key={index}>{renderProjects()}</div>;
            case ResumeSectionKey.SKILLS:
              return <div key={index}>{renderSkills()}</div>;
            case ResumeSectionKey.CERTIFICATIONS:
              return <div key={index}>{renderCertifications()}</div>;
            case ResumeSectionKey.REFERENCES:
              return <div key={index}>{renderReferences()}</div>;
            default:
              return <div key={index}>{renderCustomSection(section.key)}</div>;
          }
        })}
    </div>
  );
};

export default CreativeTemplate;