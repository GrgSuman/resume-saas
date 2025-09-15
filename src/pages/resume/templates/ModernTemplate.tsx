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
} from "../../../types/resumeDataType";
import CircularLoadingIndicator from "../../../components/sections/CircularLoadingIndicator";
import { SECTION_LABELS } from "../../../lib/constants";

const ModernTemplate = ({
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

      {/* Name */}
      <div className="text-center mb-1">
        <h1
          className="font-bold tracking-wider text-black"
          style={{ fontSize: "20px", textTransform: "uppercase" }}
        >
          {personalInfo?.name}
        </h1>
        <div className="text-sm my-1 flex flex-wrap justify-center gap-x-2">
          {[
            personalInfo?.label,
            personalInfo?.email && (
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            ),
            personalInfo?.phone,
            personalInfo?.address,
          ]
            .filter(Boolean)
            .map((item, idx, arr) => (
              <span key={idx} className="block">
                {item}
                {idx < arr.length - 1 && " | "}
              </span>
            ))}
        </div>
        <div className="text-sm flex mt-1 flex-wrap justify-center gap-x-2">
          {[
            personalInfo?.linkedin && (
              <a href={personalInfo.linkedin}>LinkedIn</a>
            ),
            personalInfo?.github && <a href={personalInfo.github}>GitHub</a>,
            personalInfo?.twitter && <a href={personalInfo.twitter}>Twitter</a>,
            personalInfo?.portfolio && (
              <a href={personalInfo.portfolio}>Portfolio</a>
            ),
          ]
            .filter(Boolean)
            .map((item, idx, arr) => (
              <span key={idx} className="block">
                {item}
                {idx < arr.length - 1 && " | "}
              </span>
            ))}
        </div>
      </div>
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
            {skills && skills.length > 0 ? "Edit Skills" : "Add Skills"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {skills?.map((skillCategory, index) => (
        <div key={index} className="mb-1">
          <div className="flex justify-between items-start">
            <div>
              {skillCategory.category && (
                <>
                  <strong>{skillCategory.category}:</strong>{" "}
                  {skillCategory.items.slice().join(", ")}
                </>
              )}
              {!skillCategory.category && (
                <>{skillCategory.items.slice().join(", ")}</>
              )}
            </div>
          </div>
        </div>
      ))}
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
            {projects && projects.length > 0 ? "Edit Projects" : "Add Project"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {projects?.map((project, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold">{project.name}</span>
            <div className="flex gap-3">
              {project.link && (
                <a
                  href={project.link}
                  className="text-blue-700 ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xs">Project Link</span>
                </a>
              )}
            </div>
          </div>
          {project.achievements && (
            <div className="ml-4">
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
            {education && education.length > 0
              ? "Edit Education"
              : "Add Education"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {education?.map((edu, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-bold">{edu.degree}</span>
            </div>
            <div>
              {edu.startDate}
              {edu.startDate && edu.endDate && " - "}
              {edu.endDate}
            </div>
          </div>
          <div>
            <span>{edu.institution}</span>
          </div>
          {edu.grade && <div className="text-sm">{edu.grade}</div>}
          {edu.description && <div className="text-sm">{edu.description}</div>}
        </div>
      ))}
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
            {experience && experience.length > 0
              ? "Edit Experience"
              : "Add Experience"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {experience?.map((exp, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-bold">{exp.role}</span>
            </div>
            <div className="flex gap-2">
              <div>
                {exp.startDate}
                {exp.startDate && exp.endDate && " - "}
                {exp.endDate}
              </div>
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
            <div className="mt-1 ml-4">
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
  );

  const renderCertifications = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">{SECTION_LABELS.certifications}</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("certifications", certifications as Certification[])
            }
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            {certifications && certifications.length > 0
              ? "Edit Certifications"
              : "Add Certifications"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {certifications?.map((cert, index) => (
        <div key={index} className="mb-2">
          <div className="flex">
            <span className="mr-2">•</span>
            <span className="flex-1">
              {cert.name}, {cert.issuer} ({cert.date})
            </span>
          </div>
          {cert.description && (
            <div className="ml-4 text-sm mt-1">{cert.description}</div>
          )}
        </div>
      ))}
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
            {references && references.length > 0
              ? "Edit References"
              : "Add References"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      {references?.map((ref, index) => (
        <div key={index} className="mb-3">
          <div className="font-bold mb-1">{ref.name}</div>
          <div className="ml-4">
            <div>
              {ref.position} {ref.position && ref.company && "at"} {ref.company}
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
            {interests && interests.length > 0
              ? "Edit Interests"
              : "Add Interest"}
          </button>
        )}
      </div>
      <div className="border-b border-black mb-2"></div>

      <div className="flex flex-wrap gap-2">
        {interests?.map((interest, index) => (
          <div key={index} className="flex items-center gap-1">
            <span>{interest}</span>
          </div>
        ))}
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
                {customSections && customSections.length > 0
                  ? "Edit Custom Sections"
                  : "Add Custom Sections"}
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

  return (
    <>
      {state.resumeSettings.sections
        ?.slice()
        .sort((a, b) => a.order - b.order)
        .map((x, index) => {
          if (x.visible) {
            switch (x.key) {
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
          }
          return null;
        })}
    </>
  );
};

export default ModernTemplate;
