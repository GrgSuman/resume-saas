import { Edit3, Plus } from "lucide-react";
import { useResume } from "../../../hooks/useResume";

import type {
  PersonalInfo,
  Education,
  Experience,
  Project,
  SkillCategory,
  Certification,
  Reference,
  CustomSection,
  Section,
} from "../../../types/resumeDataType";
import CircularLoadingIndicator from "../../../components/sections/CircularLoadingIndicator";
import { SECTION_LABELS } from "../../../lib/constants";

const TwoColumnTemplate = ({
  setActiveForm,
  setFormData,
}: {
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
  const { state } = useResume();

  if (!state.resumeData || !state.resumeSettings)
    return <CircularLoadingIndicator />;

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

  const openForm = (
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
    setActiveForm(formType);
    setFormData(data);
  };

  const renderPersonalInfo = () => (
    <div className="mb-4">
      {state.resumeEditingMode && (
        <div className="flex justify-end items-center mb-1">
          <button
            onClick={() =>
              openForm("personalInfo", personalInfo as PersonalInfo)
            }
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Edit3 className="h-3 w-3" />
            Edit Info
          </button>
        </div>
      )}

      <div className="text-center mb-3 border-b-1 border-black pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className="text-left flex-1">
            {personalInfo?.address && <div>{personalInfo.address}</div>}
            {personalInfo?.github && (
              <div className="mt-1">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.github}
                </a>
              </div>
            )}
            {personalInfo?.linkedin && (
              <div className="mt-1">
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.linkedin}
                </a>
              </div>
            )}
            {personalInfo?.twitter && (
              <div className="mt-1">
                <a
                  href={personalInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.twitter}
                </a>
              </div>
            )}
          </div>
          <div className="flex-1 text-center">
            <h1
              className="font-bold tracking-wider"
              style={{ fontSize: "20px" }}
            >
              {personalInfo?.name?.toUpperCase()}
            </h1>
            {personalInfo?.label && (
              <div className=" text-gray-600 mt-1">{personalInfo.label}</div>
            )}
          </div>
          <div className="text-right flex-1">
            {personalInfo?.phone && <div>{personalInfo.phone}</div>}
            {personalInfo?.email && (
              <div className="mt-1">
                <a
                  href={`mailto:${personalInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo?.portfolio && (
              <div className="mt-1">
                <a
                  href={personalInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.portfolio}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo?.summary && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">{SECTION_LABELS.summary}</h2>
          <div className="border-b border-black mb-2"></div>
          <div>
            <div className="mb-1">{personalInfo.summary}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.skills}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("skills", skills as SkillCategory[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Skills
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        {skills?.map((category, index) => (
          <div key={index} className="mb-3">
            <div className="font-semibold mb-2">{category.category}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {category.items
                  .slice(0, Math.ceil(category.items.length / 2))
                  .map((skill, skillIndex) => (
                    <div key={skillIndex} className="mb-1 flex">
                      <span className="mr-2">•</span>
                      <span>{skill}</span>
                    </div>
                  ))}
              </div>
              <div>
                {category.items
                  .slice(Math.ceil(category.items.length / 2))
                  .map((skill, skillIndex) => (
                    <div key={skillIndex} className="mb-1 flex">
                      <span className="mr-2">•</span>
                      <span>{skill}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.projects}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("projects", projects as Project[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Projects
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        {projects?.map((project, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div className="font-bold">
                {project.name}
                {project.link && (
                  <span className="font-normal">
                    {" "}
                    |{" "}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {project.link}
                    </a>
                  </span>
                )}
              </div>
            </div>
            {project.achievements && (
              <div>
                {project.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="mb-1 flex">
                    <span className="mr-2">•</span>
                    <span className="flex-1">{achievement}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.education}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("education", education as Education[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Education
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        {education?.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="mb-1">
              <div className="font-bold">
                {edu.degree} | {edu.institution}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                {edu.grade && <div className="mb-1">{edu.grade}</div>}
                {edu.description && (
                  <div className=" text-gray-600">{edu.description}</div>
                )}
              </div>

              <div>
                {edu.startDate}
                {edu.startDate && edu.endDate && " - "}
                {edu.endDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.experience}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("experience", experience as Experience[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Experience
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        {experience?.map((exp, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold">{exp.role}</span>
              </div>
              <div>
                {exp.startDate}
                {exp.startDate && exp.endDate && " - "}
                {exp.endDate}
              </div>
            </div>
            <div>
              <span>
                {exp.company}
                {exp.company && exp.location && " - "}
                {exp.location}
              </span>
            </div>
            {exp.achievements && (
              <div className="mt-1">
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="mb-1 flex">
                    <span className="mr-2">•</span>
                    <span className="flex-1">{achievement}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">
          {SECTION_LABELS.certifications}
        </h2>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("certifications", certifications as Certification[])
            }
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Certifications
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        {certifications?.map((cert, index) => (
          <div key={index} className="mb-2">
            <div className="flex">
              <span className="mr-2">•</span>
              <span className="flex-1">
                {cert.name}, {cert.issuer} ({cert.date})
              </span>
            </div>
            {cert.description && (
              <div className="ml-4  text-gray-600 mt-1">{cert.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReferences = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.references}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("references", references as Reference[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit References
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        {references?.map((ref, index) => (
          <div key={index} className="mb-3">
            <div className="font-bold mb-1">{ref.name}</div>
            <div>
              <div>
                {ref.position} {ref.position && ref.company && "at"}{" "}
                {ref.company}
              </div>
              {ref.contact && (
                <div>
                  <a
                    href={`mailto:${ref.contact}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {ref.contact}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterests = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.interests}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("interests", interests as string[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Interests
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div>
        <div className="flex flex-wrap gap-2">
          {interests?.map((interest, index) => (
            <span key={index} className="bg-gray-200 rounded px-3 py-1">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold tracking-wide uppercase">{section.title?.toUpperCase()}</h2>
            {state.resumeEditingMode && (
              <button
                onClick={() =>
                  openForm("customSections", customSections as CustomSection[])
                }
                className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                <Plus className="h-3 w-3" />
                Edit Custom Sections
              </button>
            )}
          </div>
          <div className="border-b border-black mb-2"></div>
          <div>
            <div>{section.content}</div>
          </div>
        </div>
      ))}
    </>
  );

  // Sort sections by order
  const sortedSections = state?.resumeSettings?.sections
    ?.slice()
    .sort((a, b) => a.order - b.order)
    .filter((x) => x.visible);

  // Split sections into left and right columns after personal info
  const personalInfoSection = sortedSections?.find(
    (s) => s.key === "personalInfo"
  );
  const otherSections = sortedSections?.filter((s) => s.key !== "personalInfo");

  // Define which sections go in left vs right column
  const leftColumnSections = otherSections?.filter((s) =>
    ["experience", "projects", "customSections"].includes(s.key)
  );

  const rightColumnSections = otherSections?.filter((s) =>
    [
      "education",
      "skills",
      "certifications",
      "references",
      "interests",
    ].includes(s.key)
  );

  const renderSection = (section: Section, index: number) => {
    switch (section.key) {
      case "personalInfo":
        return <div key={index}>{renderPersonalInfo()}</div>;
      case "skills":
        return <div key={index}>{renderSkills()}</div>;
      case "projects":
        return <div key={index}>{renderProjects()}</div>;
      case "education":
        return <div key={index}>{renderEducation()}</div>;
      case "experience":
        return <div key={index}>{renderExperience()}</div>;
      case "certifications":
        return <div key={index}>{renderCertifications()}</div>;
      case "references":
        return <div key={index}>{renderReferences()}</div>;
      case "interests":
        return <div key={index}>{renderInterests()}</div>;
      case "customSections":
        return <div key={index}>{renderCustomSections()}</div>;
      default:
        return null;
    }
  };

  return (
    <>
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
        <div className="w-80 space-y-6">
          {rightColumnSections?.map((section, index) => (
            <div key={section.key} className="break-inside-avoid">
              {renderSection(
                section,
                index + (leftColumnSections?.length || 0) + 1
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TwoColumnTemplate;
