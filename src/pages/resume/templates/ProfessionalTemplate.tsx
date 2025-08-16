import { useState } from "react";
import { Edit3, Plus } from "lucide-react";
import { useResume } from "../../../hooks/useResume";

// Form imports
import PersonalInfoForm from "../forms/PersonalInfoForm";
import ExperienceForm from "../forms/ExperienceForm";
import EducationForm from "../forms/EducationForm";
import ProjectsForm from "../forms/ProjectsForm";
import SkillsForm from "../forms/SkillsForm";
import CertificationsForm from "../forms/CertificationsForm";
import ReferencesForm from "../forms/ReferencesForm";
import InterestsForm from "../forms/InterestsForm";
import CustomSectionForm from "../forms/CustomSectionForm";

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

const ProfessionalTemplate = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { state, dispatch } = useResume();
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

  if (!state.resumeData) return null;

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

  // Early return if resumeSettings is null
  if (!state.resumeSettings) return null;

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

  const closeForm = () => {
    setActiveForm(null);
    setFormData(null);
  };

  const handleSave = (
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
    dispatch({ type: "UPDATE_RESUME_DATA", payload: { [formType]: data } });
    closeForm();
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
      
             {/* Centered Header Section */}
       <div className="text-center mb-4">
         <h1 className="font-bold tracking-wider mb-2 text-xl">
           {personalInfo?.name?.toUpperCase()}
         </h1>
         
         {/* Contact Information */}
         <div className="mb-2">
           {personalInfo?.address && <span>{personalInfo.address}</span>}
           {personalInfo?.address && personalInfo?.email && <span> | </span>}
           {personalInfo?.email && (
             <a
               href={`mailto:${personalInfo.email}`}
               target="_blank"
               rel="noopener noreferrer"
               className="hover:underline"
             >
               {personalInfo.email}
             </a>
           )}
           {personalInfo?.email && personalInfo?.portfolio && <span> | </span>}
           {personalInfo?.portfolio && (
             <a
               href={personalInfo.portfolio}
               target="_blank"
               rel="noopener noreferrer"
               className="hover:underline"
             >
               {personalInfo.portfolio}
             </a>
           )}
         </div>
         
         {/* Professional Title */}
         {personalInfo?.label && (
           <div className="font-semibold text-md">
             {personalInfo.label.toUpperCase()}
           </div>
         )}
       </div>

             {/* Summary */}
       {personalInfo?.summary && (
         <div className="mb-4">
           <div className="bg-gray-100 px-3 py-1 mb-2">
             <h2 className="font-bold uppercase">SUMMARY</h2>
           </div>
           <div className="px-2">
             <p>{personalInfo.summary}</p>
           </div>
         </div>
       )}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">TECHNICAL SKILLS</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("skills", skills as SkillCategory[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Skills
          </button>
        )}
      </div>

      <div className="px-2">
        {skills?.map((category, index) => (
          <div key={index} className="mb-3">
            <div className="font-semibold mb-2">{category.category}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {category.items.slice(0, Math.ceil(category.items.length / 2)).map((skill, skillIndex) => (
                  <div key={skillIndex} className="mb-1 flex">
                    <span className="mr-2">•</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
              <div>
                {category.items.slice(Math.ceil(category.items.length / 2)).map((skill, skillIndex) => (
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">PROJECTS</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("projects", projects as Project[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Projects
          </button>
        )}
      </div>

      <div className="px-2">
        {projects?.map((project, index) => (
          <div key={index} className="mb-4">
                         <div className="flex justify-between items-start mb-1">
               <div className="font-bold">
                 {project.name}
                 {project.link && (
                   <span className="font-normal"> | {project.link}</span>
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">EDUCATION</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("education", education as Education[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Education
          </button>
        )}
      </div>

      <div className="px-2">
        {education?.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div className="font-bold">
                {edu.degree} | {edu.institution}
              </div>
              <div className="text-sm">
                {edu.startDate}
                {edu.startDate && edu.endDate && " - "}
                {edu.endDate}
              </div>
            </div>
            <div>
              {edu.grade && <div className="mb-1">{edu.grade}</div>}
              {edu.description && (
                <div className="text-sm text-gray-600">{edu.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">WORK EXPERIENCE</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("experience", experience as Experience[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Experience
          </button>
        )}
      </div>

      <div className="px-2">
        {experience?.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div className="font-bold">
                {exp.role} | {exp.company}
              </div>
              <div className="text-sm">
                {exp.startDate}
                {exp.startDate && exp.endDate && " - "}
                {exp.endDate}
              </div>
            </div>
            {exp.location && (
              <div className="text-sm text-gray-600 mb-2">{exp.location}</div>
            )}
            {exp.achievements && (
              <div>
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">AWARDS & ACHIEVEMENTS</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("certifications", certifications as Certification[])
            }
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Certifications
          </button>
        )}
      </div>

      <div className="px-2">
        {certifications?.map((cert, index) => (
          <div key={index} className="mb-2">
            <div className="flex">
              <span className="mr-2">•</span>
              <span className="flex-1">
                {cert.name}, {cert.issuer} ({cert.date})
              </span>
            </div>
            {cert.description && (
              <div className="ml-4 text-sm text-gray-600 mt-1">
                {cert.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReferences = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">REFERENCES</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("references", references as Reference[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit References
          </button>
        )}
      </div>

      <div className="px-2">
        {references?.map((ref, index) => (
          <div key={index} className="mb-3">
            <div className="font-bold mb-1">{ref.name}</div>
            <div>
              <div>
                {ref.position} at {ref.company}
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">INTERESTS</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() => openForm("interests", interests as string[])}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Interests
          </button>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {interests?.map((interest, index) => (
            <span
              key={index}
              className="bg-gray-200 rounded px-3 py-1"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-100 px-3 py-2 flex-1">
          <h2 className="font-bold uppercase">CUSTOM SECTIONS</h2>
        </div>
        {state.resumeEditingMode && (
          <button
            onClick={() =>
              openForm("customSections", customSections as CustomSection[])
            }
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
          >
            <Plus className="h-3 w-3" />
            Edit Custom Sections
          </button>
        )}
      </div>

      <div className="px-2">
        {customSections?.map((section, index) => (
          <div key={index} className="mb-3">
            <div className="font-bold mb-1">{section.title}</div>
            <div>
              <div>{section.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      <div
        className="max-w-[210mm] min-w-[210mm] max-h-[297mm] min-h-[297mm] mx-auto bg-white text-black p-6 py-8 overflow-hidden"
        style={{
          fontSize: `${state.resumeSettings.fontSize}px`,
          boxSizing: "border-box",
          fontFamily: state.resumeSettings.fontFamily,
          lineHeight: state.resumeSettings.lineHeight,
        }}
      >
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
      </div>

      {/* Form Modals */}
      {activeForm === "personalInfo" && (
        <PersonalInfoForm
          isOpen={true}
          data={formData as PersonalInfo}
          onSave={(data) => handleSave("personalInfo", data as PersonalInfo)}
          onClose={closeForm}
        />
      )}

      {activeForm === "experience" && (
        <ExperienceForm
          isOpen={true}
          data={formData as Experience[]}
          onSave={(data) => handleSave("experience", data as Experience[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "education" && (
        <EducationForm
          isOpen={true}
          data={formData as Education[]}
          onSave={(data) => handleSave("education", data as Education[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "projects" && (
        <ProjectsForm
          isOpen={true}
          data={formData as Project[]}
          onSave={(data) => handleSave("projects", data as Project[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "skills" && (
        <SkillsForm
          isOpen={true}
          data={formData as SkillCategory[]}
          onSave={(data) => handleSave("skills", data as SkillCategory[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "certifications" && (
        <CertificationsForm
          isOpen={true}
          data={formData as Certification[]}
          onSave={(data) =>
            handleSave("certifications", data as Certification[])
          }
          onClose={closeForm}
        />
      )}

      {activeForm === "references" && (
        <ReferencesForm
          isOpen={true}
          data={formData as Reference[]}
          onSave={(data) => handleSave("references", data as Reference[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "interests" && (
        <InterestsForm
          isOpen={true}
          data={formData as string[]}
          onSave={(data) => handleSave("interests", data as string[])}
          onClose={closeForm}
        />
      )}

      {activeForm === "customSections" && (
        <CustomSectionForm
          isOpen={true}
          data={formData as CustomSection[]}
          onSave={(data) =>
            handleSave("customSections", data as CustomSection[])
          }
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default ProfessionalTemplate;
