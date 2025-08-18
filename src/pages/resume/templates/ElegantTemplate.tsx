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

const ElegantTemplate = ({
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
    <div className="mb-6">
      {state.resumeEditingMode && (
        <div className="flex justify-end items-center mb-2">
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

      <div className="mb-4 bg-gray-100 p-3">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-bold tracking-wider" style={{ fontSize: "20px" }}>
            {personalInfo?.name?.toUpperCase()}
          </h1>
          {personalInfo?.label && (
            <div className="text-gray-600 mt-1">{personalInfo.label}</div>
          )}
          <div className="mt-2 flex flex-wrap justify-center gap-2  p-3 rounded">
            {personalInfo?.email && (
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            )}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.address && <span>{personalInfo.address}</span>}
            {personalInfo?.portfolio && (
              <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">
                {personalInfo.portfolio}
              </a>
            )}
            {personalInfo?.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                {personalInfo.github}
              </a>
            )}
            {personalInfo?.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                {personalInfo.linkedin}
              </a>
            )}
            {personalInfo?.twitter && (
              <a href={personalInfo.twitter} target="_blank" rel="noopener noreferrer">
                {personalInfo.twitter}
              </a>
            )}
          </div>
        </div>
      </div>

      {personalInfo?.summary && (
        <div className="mt-6 mb-6">
          <div className="flex items-stretch justify-between">
            <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">SUMMARY</div>
            <div className="w-3/4 pl-6">
              <div>{personalInfo.summary}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">WORK EXPERIENCE</div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("experience", experience as Experience[])}
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Experience
          </button>
        )}
        <div className="w-3/4 pl-6">
          {experience?.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">
                  {exp.role}
                  {(exp.company || exp.location) && (
                    <span>{`${exp.company ? `, ${exp.company}` : ""}${exp.location ? `, ${exp.location}` : ""}`}</span>
                  )}
                </div>
                <div>
                  {exp.startDate}
                  {exp.startDate && exp.endDate && " - "}
                  {exp.endDate}
                </div>
              </div>
              {exp.achievements && (
                <div className="mt-1">
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex">
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
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">EDUCATION</div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("education", education as Education[])}
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Education
          </button>
        )}
        <div className="w-3/4 pl-6">
          {education?.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">{edu.institution}</div>
                <div>
                  {edu.startDate}
                  {edu.startDate && edu.endDate && " - "}
                  {edu.endDate}
                </div>
              </div>
              <div className="mb-1">
                {edu.degree}
                {edu.degree && edu.grade && " - "}
                {edu.grade}
              </div>
              {edu.description && (
                <div className="text-gray-600 mt-1">{edu.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">PROJECTS</div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("projects", projects as Project[])}
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Projects
          </button>
        )}
        <div className="w-3/4 pl-6">
          {projects?.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">{project.name}</div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Project Link
                  </a>
                )}
              </div>
              {project.achievements && (
                <div className="mt-1">
                  {project.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex">
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
    </div>
  );

  const renderSkills = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">KEY SKILLS</div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("skills", skills as SkillCategory[])}
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Skills
          </button>
        )}
        <div className="w-3/4 pl-6">
          <div className="grid grid-cols-2 gap-x-8">
            {(skills?.flatMap((c) => c.items) || []).map((skill, index) => (
              <div key={index} className="flex">
                <span className="mr-2">•</span>
                <span className="flex-1">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">CERTIFICATIONS</div>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("certifications", certifications as Certification[])
            }
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Certifications
          </button>
        )}
        <div className="w-3/4 pl-6">
          {certifications?.map((cert, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">{cert.name}</div>
                <div>{cert.date}</div>
              </div>
              <div>{cert.issuer}</div>
              {cert.description && (
                <div className="mt-1">{cert.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReferences = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">REFERENCES</div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("references", references as Reference[])}
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit References
          </button>
        )}
        <div className="w-3/4 pl-6">
          {references?.map((ref, index) => (
            <div key={index} className="mb-4">
              <div className="font-bold mb-1">{ref.name}</div>
              <div>
                {ref.position} {ref.position && ref.company && "at"} {ref.company}
              </div>
              {ref.contact && (
                <div>
                  <a href={`mailto:${ref.contact}`} className="text-blue-600 hover:text-blue-800">
                    {ref.contact}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInterests = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">INTERESTS</div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("interests", interests as string[])}
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Interests
          </button>
        )}
        <div className="w-3/4 pl-6">
          <div className="grid grid-cols-2 gap-x-8">
            {interests?.map((interest, index) => (
              <div key={index} className="flex">
                <span className="mr-2">•</span>
                <span className="flex-1">{interest}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <div className="mb-6">
      <div className="flex items-stretch justify-between relative">
        <div className="w-1/4 font-bold tracking-wide uppercase border-r border-gray-300 pr-4">CUSTOM SECTIONS</div>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("customSections", customSections as CustomSection[])
            }
            className="absolute right-0 -top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
            Edit Custom Sections
          </button>
        )}
        <div className="w-3/4 pl-6">
          {customSections?.map((section, index) => (
            <div key={index} className="mb-4">
              <div className="font-bold mb-1 uppercase tracking-wide">{section.title}</div>
              <div>{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-justify">
      {state.resumeSettings.sections
        ?.slice()
        .sort((a, b) => a.order - b.order)
        .map((x, index) => {
          if (x.visible) {
            switch (x.key) {
              case "personalInfo":
                return <div key={index}>{renderPersonalInfo()}</div>;
              case "experience":
                return <div key={index}>{renderExperience()}</div>;
              case "education":
                return <div key={index}>{renderEducation()}</div>;
              case "projects":
                return <div key={index}>{renderProjects()}</div>;
              case "skills":
                return <div key={index}>{renderSkills()}</div>;
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
    </div>
  );
};

export default ElegantTemplate;
