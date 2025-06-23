import { demoData } from "../../../demo_data";
import type { ResumeData } from "../../../types/resumeTypes";

const ResumeTemplate = ({ data = demoData, ref }: { data: ResumeData, ref: React.RefObject<HTMLDivElement | null> }) => {
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
  } = data;

  return (
    <div ref={ref} className="max-w-[210mm] min-w-[210mm]  min-h-[297mm] max-h-[297mm]">
    <div  className="max-w-[210mm] min-w-[210mm]  min-h-[297mm] max-h-[297mm] mx-auto bg-white text-black leading-tight font-serif p-6 py-8 overflow-hidden"
      style={{ fontSize: "13px",boxSizing: "border-box" }}
    >
      {/* Header */}
      <div className="text-center mb-4 border-b-1 border-black pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className="text-left flex-1">
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {personalInfo.github && (
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
            {personalInfo.linkedin && (
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
            {personalInfo.twitter && (
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
              {personalInfo.name.toUpperCase()}
            </h1>
          </div>
          <div className="text-right flex-1">
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && (
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
            {personalInfo.website && (
              <div className="mt-1">
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">EDUCATION</h2>
          <div className="border-b border-black mb-2"></div>
          {education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold">{edu.institution}</div>
                <div>
                  {edu.startDate}-{edu.endDate}
                </div>
              </div>
              <div className="ml-4">
                <div className="mb-1">
                  {edu.degree} {edu.grade && <span> - {edu.grade}</span>}
                  {edu.description && <p> {edu.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employment */}
      {experience && experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">EMPLOYMENT</h2>
          <div className="border-b border-black mb-2"></div>
          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-bold">{exp.role}</span>
                </div>
                <div>
                  {exp.startDate}-{exp.endDate}
                </div>
              </div>
              <div>
                <span>
                  {exp.company} - {exp.location}
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
      )}

      {/* Software Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">
            SOFTWARE PROJECTS
          </h2>
          <div className="border-b border-black mb-2"></div>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="font-bold mb-1 flex justify-between items-start">
                {project.name}
                {project.link && (
                  <a href={project.link} className="text-blue-700" target="_blank" rel="noopener noreferrer">
                    <span>Project Link</span>
                  </a>
                )}
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
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">SKILLS</h2>
          <div className="border-b border-black mb-2"></div>
          {skills.map((skillCategory, index) => (
            <div key={index} className="mb-1">
              {skillCategory.category && (
                <>
                  <strong>{skillCategory.category}:</strong>{" "}
                  {skillCategory.items.slice(0, 6).join(", ")}
                </>
              )}
              {!skillCategory.category && (
                <>{skillCategory.items.slice(0, 6).join(", ")}</>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">
            CERTIFICATIONS
          </h2>
          <div className="border-b border-black mb-2"></div>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{cert.name}</span>
                <span>{cert.date}</span>
              </div>
              {cert.issuer && <div>{cert.issuer}</div>}
              {cert.description && <div>{cert.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">REFERENCES</h2>
          <div className="border-b border-black mb-2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {references.map((ref, index) => (
              <div key={index}>
                <div className="font-bold">{ref.name}{ref.position && <> — {ref.position}</>}</div>
                <div>
                  {ref.company && <span>{ref.company}  | </span>}
                  {ref.contact && <span>{ref.contact}</span>}
                  {ref.relationship && <span> | {ref.relationship}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-1 tracking-wide uppercase">INTERESTS</h2>
          <div className="border-b border-black mb-2"></div>
          <div>{interests.join(", ")}</div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="mb-4">
          {customSections.map((section, index) => (
            <div key={index} className="mb-2">
              <h2 className="font-bold mb-1 tracking-wide uppercase">
                {section.title}
              </h2>
              <div className="border-b border-black mb-2"></div>
              <div>{section.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
</div>
  );
};

export default ResumeTemplate;
