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

const CreativeTemplate = ({
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
              <div className="text-sm text-gray-600 mt-1">
                {personalInfo.label}
              </div>
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
          <h2 className="font-bold mb-1 tracking-wide uppercase">SUMMARY</h2>
          <div className="border-b border-black mb-2"></div>
          <div>
            <div className="mb-1">{personalInfo.summary}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">EMPLOYMENT</h2>
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

  const renderEducation = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">EDUCATION</h2>
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

      {education?.map((edu, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-bold">{edu.institution}</span>
            </div>
            <div className="flex gap-2">
              <div>
                {edu.startDate}
                {edu.startDate && edu.endDate && " - "}
                {edu.endDate}
              </div>
            </div>
          </div>
          <div className="ml-4">
            <div className="mb-1">
              {edu.degree}
              {edu.degree && edu.grade && " - "}
              {edu.grade}
              {edu.description && (
                <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
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
        <h2 className="font-bold tracking-wide uppercase">PROJECTS</h2>
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

      {projects?.map((project, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-bold">{project.name}</span>
            </div>
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
            <div className="mt-1 ml-4">
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

  const renderSkills = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">SKILLS</h2>
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

      {skills?.map((category, index) => (
        <div key={index} className="mb-3">
          <div className="font-bold mb-1">{category.category}</div>
          <div>
            {category.items.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="inline-block bg-gray-200 rounded px-2 py-1 mr-3 mb-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertifications = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">CERTIFICATIONS</h2>
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

      {certifications?.map((cert, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-bold">{cert.name}</span>
            </div>
            <div className="flex gap-2">
              <div>{cert.date}</div>
            </div>
          </div>
          <div>
            <span>{cert.issuer}</span>
          </div>
          {cert.description && (
            <div className="mt-1 ml-4">
              <div className="mb-1">{cert.description}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderReferences = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">REFERENCES</h2>
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
        <h2 className="font-bold tracking-wide uppercase">INTERESTS</h2>
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
        {interests?.map((interest, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded px-2 py-1 mr-3 mb-1"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold tracking-wide uppercase">CUSTOM SECTIONS</h2>
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

      {customSections?.map((section, index) => (
        <div key={index} className="mb-3">
          <div className="font-bold mb-1">{section.title}</div>
          <div className="ml-4">
            <div>{section.content}</div>
          </div>
        </div>
      ))}
    </div>
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
    </>
  );
};

export default CreativeTemplate;
