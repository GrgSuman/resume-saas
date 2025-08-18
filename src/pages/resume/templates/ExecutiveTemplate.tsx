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

const ExecutiveTemplate = ({
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
    <div className="text-white">
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
      <div className="mb-6">
        <h1
          className="font-bold text-white mb-1"
          style={{ fontSize: "22px" }}
        >
          {personalInfo?.name}
        </h1>
        {personalInfo?.label && (
          <div className="text-gray-300">
            {personalInfo.label}
          </div>
        )}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="mb-6">
      <h2 className="font-bold text-white mb-3">Contact</h2>
      <div className="text-gray-300 space-y-2">
        {personalInfo?.email && (
          <div className="flex items-center gap-2"> 
            <a
              href={`mailto:${personalInfo.email}`}
              className="hover:text-white transition-colors"
            >
              {personalInfo.email}
            </a>
          </div>
        )}
        {personalInfo?.phone && (
          <div className="flex items-center gap-2">
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {personalInfo?.address && (
          <div className="flex items-center gap-2">
            <span>{personalInfo.address}</span>
          </div>
        )}
        {personalInfo?.portfolio && (
          <div className="flex items-center gap-2">
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors break-all"
            >
              {personalInfo.portfolio}
            </a>
          </div>
        )}
        {personalInfo?.linkedin && (
          <div className="flex items-center gap-2">
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors break-all"
            >
              {personalInfo.linkedin}
            </a>
          </div>
        )}
        {personalInfo?.github && (
          <div className="flex items-center gap-2">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors break-all"
            >
              {personalInfo.github}
            </a>
          </div>
        )}
      </div>
    </div>
  );


  const renderSidebarSkills = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-white">Skills</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("skills", skills as SkillCategory[])}
            className="flex items-center gap-1 px-1 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="text-gray-300 space-y-1">
        {skills?.map((category, index) => (
          <div key={index}>
            <div className="font-medium text-white mb-1">{category.category}</div>
            {category.items.map((skill, skillIndex) => (
              <div key={skillIndex} className="mb-1">• {skill}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSidebarCertifications = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-white">Certifications</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("certifications", certifications as Certification[])
            }
            className="flex items-center gap-1 px-1 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="text-gray-300 space-y-2">
        {certifications?.map((cert, index) => (
          <div key={index}>
            <div className="font-medium text-white">{cert.name}</div>
            <div className="flex justify-between items-start">
              <div>{cert.issuer}</div>
              <div>{cert.date}</div>
            </div>
            {cert.description && <div className="mt-1">{cert.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSidebarInterests = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-white">Interests</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("interests", interests as string[])}
            className="flex items-center gap-1 px-1 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="text-gray-300">
        {interests?.map((interest, index) => (
          <span key={index} className="mr-2">
            {interest}
            {index < interests.length - 1 && ","}
          </span>
        ))}
      </div>
    </div>
  );

  const renderAboutMe = () => (
    <div className="mb-6">
      <h2 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">About Me</h2>
      {personalInfo?.summary && (
        <div className="text-gray-700 leading-relaxed">
          {personalInfo.summary}
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-800 border-b border-gray-300 mb-1">Work Experience</h2>
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

      {experience?.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-start mb-1">
          <div className="text-gray-600 mb-1">{exp.company}</div>
          <div className="flex justify-between items-start mb-1">
            <div className="text-gray-600">
              {exp.startDate}
              {exp.startDate && exp.endDate && " - "}
              {exp.endDate || "present"}
            </div>
          </div>
          </div>
          <div className="font-bold text-gray-800 mb-2">{exp.role}</div>
          {exp.achievements && (
            <div className="text-gray-700">
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

  const renderProjects = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-gray-800 border-b border-gray-300 pb-1">Projects</h2>
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

      {projects?.map((project, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div className="font-bold text-gray-800">{project.name}</div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Link
              </a>
            )}
          </div>
          {project.achievements && (
            <div className="text-gray-700">
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

  const renderEducationMain = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-gray-800 border-b border-gray-300 pb-1">Education</h2>
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
      {education?.map((edu, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-start">
            <div className="font-bold text-gray-800">{edu.institution}</div>
            <div className="text-gray-600">
              {edu.startDate}
              {edu.startDate && edu.endDate && " - "}
              {edu.endDate}
            </div>
          </div>
          <div className="text-gray-700">
            {edu.degree}
            {edu.degree && edu.grade && " - "}
            {edu.grade}
          </div>
        </div>
      ))}
    </div>
  );

  const renderReferencesMain = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-gray-800 border-b border-gray-300 pb-1">References</h2>
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
      <div className="text-gray-700 space-y-3">
        {references?.map((ref, index) => (
          <div key={index}>
            <div className="font-bold text-gray-800">{ref.name}</div>
            <div>{ref.company} / {ref.position}</div>
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
  );

  const renderSidebarCustomSections = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-white">Custom Sections</h2>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("customSections", customSections as CustomSection[])
            }
            className="flex items-center gap-1 px-1 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      {customSections?.map((section, index) => (
        <div key={index} className="mb-3">
          <div className="font-bold text-white">{section.title}</div>
          <div className="text-gray-300">{section.content}</div>
        </div>
      ))}
    </div>
  );

  const getSidebarSections = () => {
    const sidebarSections = ['personalInfo', 'skills', 'certifications', 'interests', 'customSections'];
    return state.resumeSettings?.sections
      ?.filter(section => sidebarSections.includes(section.key) && section.visible)
      .sort((a, b) => a.order - b.order);
  };

  const getMainSections = () => {
    const mainSections = ['experience', 'projects', 'education', 'references'];
    return state.resumeSettings?.sections
      ?.filter(section => mainSections.includes(section.key) && section.visible)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className="flex bg-white h-[1123px] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-slate-700 p-6 text-white">
        {renderPersonalInfo()}
        {renderContact()}
        
        {getSidebarSections()?.map((section, index) => {
          switch (section.key) {
            case "skills":
              return <div key={index}>{renderSidebarSkills()}</div>;
            case "certifications":
              return <div key={index}>{renderSidebarCertifications()}</div>;
            case "interests":
              return <div key={index}>{renderSidebarInterests()}</div>;
            case "customSections":
              return <div key={index}>{renderSidebarCustomSections()}</div>;
            default:
              return null;
          }
        })}
      </div>

      {/* Right Main Content */}
      <div className="w-2/3 p-6 text-justify">
        {personalInfo?.summary && renderAboutMe()}
        
        {getMainSections()?.map((section, index) => {
          switch (section.key) {
            case "experience":
              return <div key={index}>{renderExperience()}</div>;
            case "projects":
              return <div key={index}>{renderProjects()}</div>;
            case "education":
              return <div key={index}>{renderEducationMain()}</div>;
            case "references":
              return <div key={index}>{renderReferencesMain()}</div>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;