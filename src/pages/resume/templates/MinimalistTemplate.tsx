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

const MinimalistTemplate = ({
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

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="text-left flex-1">
            {personalInfo?.address && <div>{personalInfo.address}</div>}
            {personalInfo?.github && (
              <div className="mt-1">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
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
                  className="text-blue-600 hover:text-blue-800"
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
                  className="text-blue-600 hover:text-blue-800"
                >
                  {personalInfo.twitter}
                </a>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1
              className="font-bold tracking-wider flex items-center justify-center"
              style={{ fontSize: "20px" }}
            >
              {personalInfo?.name?.toUpperCase()}
            </h1>
            {personalInfo?.label && (
              <div className="text-gray-600 mt-1 flex items-center justify-center">{personalInfo.label}</div>
            )}
          </div>
          <div className="text-right flex-1">
            {personalInfo?.phone && <div>{personalInfo.phone}</div>}
            {personalInfo?.email && (
              <div className="mt-1">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-blue-600 hover:text-blue-800"
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
                  className="text-blue-600 hover:text-blue-800"
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
        <div className="mb-6">
          <div className="flex">
            <div className="w-1/4 font-bold uppercase tracking-wide">
              SUMMARY
            </div>
            <div className="w-3/4 pl-4">
              <div>{personalInfo.summary}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      <div className="flex relative">
        <div className="w-1/4 uppercase tracking-wide ">
         <h1 className="font-bold">PROFESSIONAL EXPERIENCE</h1> 
          {state.resumeEditingMode && (
            <button
              onClick={() => openForm("experience", experience as Experience[])}
              className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              <Plus className="h-3 w-3" />
              Edit Experience
            </button>
          )}
        </div>
        <div className="w-3/4 pl-4">
          {experience?.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="font-bold uppercase tracking-wide mb-1">
                {exp.role}
              </div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  {exp.company}
                  {exp.company && exp.location && " - "}
                  {exp.location}
                </div>
                <div className="text-gray-600">
                  {exp.startDate}
                  {exp.startDate && exp.endDate && " - "}
                  {exp.endDate}
                </div>
              </div>
              {exp.achievements && (
                <div className="mt-2">
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
    </div>
  );

     const renderEducation = () => (
     <div className="mb-6">
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">EDUCATION</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() => openForm("education", education as Education[])}
               className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit Education
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           {education?.map((edu, index) => (
             <div key={index} className="mb-4">
               <div className="font-bold uppercase tracking-wide mb-1">
                 {edu.institution}
               </div>
               <div className="flex justify-between items-start mb-1">
                 <div>
                   {edu.degree}
                   {edu.degree && edu.grade && " - "}
                   {edu.grade}
                 </div>
                 <div className="text-gray-600">
                   {edu.startDate}
                   {edu.startDate && edu.endDate && " - "}
                   {edu.endDate}
                 </div>
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
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">PROJECTS</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() => openForm("projects", projects as Project[])}
               className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit Projects
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           {projects?.map((project, index) => (
             <div key={index} className="mb-4">
               <div className="font-bold uppercase tracking-wide mb-1">
                 {project.name}
               </div>
               {project.link && (
                 <div className="mb-2">
                   <a
                     href={project.link}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:text-blue-800"
                   >
                     Project Link
                   </a>
                 </div>
               )}
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
     </div>
   );

     const renderSkills = () => (
     <div className="mb-6">
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">SKILLS</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() => openForm("skills", skills as SkillCategory[])}
               className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit Skills
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           {skills?.map((category, index) => (
             <div key={index} className="mb-4">
               <div className="font-bold uppercase tracking-wide mb-1">
                 {category.category}
               </div>
               <div className="flex flex-wrap gap-2">
                 {category.items.map((skill, skillIndex) => (
                   <span
                     key={skillIndex}
                     className="inline-block bg-gray-200 rounded px-2 py-1"
                   >
                     {skill}
                   </span>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
   );

     const renderCertifications = () => (
     <div className="mb-6">
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">CERTIFICATES</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() =>
                 openForm("certifications", certifications as Certification[])
               }
               className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit Certifications
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           {certifications?.map((cert, index) => (
             <div key={index} className="mb-4">
               <div className="font-bold uppercase tracking-wide mb-1">
                 {cert.name}
               </div>
               <div className="flex justify-between items-start">
                 <div>{cert.issuer}</div>
                 <div className="text-gray-600">{cert.date}</div>
               </div>
               {cert.description && (
                 <div className="text-gray-600 mt-1">{cert.description}</div>
               )}
             </div>
           ))}
         </div>
       </div>
     </div>
   );

     const renderReferences = () => (
     <div className="mb-6">
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">REFERENCES</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() => openForm("references", references as Reference[])}
               className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit References
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           {references?.map((ref, index) => (
             <div key={index} className="mb-4">
               <div className="font-bold uppercase tracking-wide mb-1">
                 {ref.name}
               </div>
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
           ))}
         </div>
       </div>
     </div>
   );

     const renderInterests = () => (
     <div className="mb-6">
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">INTERESTS</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() => openForm("interests", interests as string[])}
               className="absolute top-[-30px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit Interests
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           <div className="flex flex-wrap gap-2">
             {interests?.map((interest, index) => (
               <span
                 key={index}
                 className="inline-block bg-gray-200 rounded px-2 py-1"
               >
                 {interest}
               </span>
             ))}
           </div>
         </div>
       </div>
     </div>
   );

     const renderCustomSections = () => (
     <div className="mb-6">
       <div className="flex relative">
         <div className="w-1/4 uppercase tracking-wide">
           <h1 className="font-bold">CUSTOM SECTIONS</h1>
           {state.resumeEditingMode && (
             <button
               onClick={() =>
                 openForm("customSections", customSections as CustomSection[])
               }
               className="absolute top-[-10px] right-0 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
             >
               <Plus className="h-3 w-3" />
               Edit Custom Sections
             </button>
           )}
         </div>
         <div className="w-3/4 pl-4">
           {customSections?.map((section, index) => (
             <div key={index} className="mb-4">
               <div className="font-bold uppercase tracking-wide mb-1">
                 {section.title}
               </div>
               <div>{section.content}</div>
             </div>
           ))}
         </div>
       </div>
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

export default MinimalistTemplate;