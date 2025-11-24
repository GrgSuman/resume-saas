import type { ResumeData, ResumeSettings } from '../../../types/resume'
import { ResumeSectionKey } from '../../../types/constants'
import {useResume} from  '../../../../../hooks/useResume'
import { Button } from '../../../../../components/ui/button'

const ProfessionalTemplate = ({resumeData, resumeSettings, openForms }: {resumeData: ResumeData, resumeSettings: ResumeSettings, openForms: (sectionKey: typeof ResumeSectionKey[keyof typeof ResumeSectionKey]) => void}) => {
  const data = resumeData
  const settings = resumeSettings
  const { state } = useResume()

  // One-button-per-section header
  const SectionHeader = ({ label, sectionKey }: { label: string | undefined, sectionKey: string }) => (
    <div className="flex items-center justify-between border-b border-black pb-1 mb-3">
      <h2 className="font-bold tracking-wide">{label}</h2>
      {state.resumeEditingMode && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openForms(sectionKey)}
          className="h-6 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
        >
          {`Edit ${label || sectionKey}`}
        </Button>
      )}
    </div>
  )

  // Render functions for each section
  const renderPersonalInfo = () => {
    // Create arrays of contact info for each line
    const firstLine = []
    const secondLine = []
    
    // First line: address, email, phone, website
    if (data.personalInfo.address) firstLine.push(data.personalInfo.address)
    if (data.personalInfo.email) firstLine.push(data.personalInfo.email)
    if (data.personalInfo.phone) firstLine.push(data.personalInfo.phone)
    if (data.personalInfo.website) firstLine.push(data.personalInfo.website)
    
    // Second line: linkedin, github, twitter
    if (data.personalInfo.linkedin) secondLine.push(data.personalInfo.linkedin)
    if (data.personalInfo.github) secondLine.push(data.personalInfo.github)
    if (data.personalInfo.twitter) secondLine.push(data.personalInfo.twitter)

    return (
      <div className="mb-4">
        {state.resumeEditingMode && (
          <div className="flex justify-end mb-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openForms(ResumeSectionKey.PERSONAL_INFO)}
              className="h-6 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
            >
              Edit Personal Info
            </Button>
          </div>
        )}
        <h1 className="text-center font-bold text-2xl mb-2">
          {data.personalInfo.name}
        </h1>
        {data.personalInfo.label && (
          <p className="text-center my-2 font-bold">
            {data.personalInfo.label}
          </p>
        )}
        {firstLine.length > 0 && (
          <div className="text-center">
            {firstLine.map((item, index) => (
              <span key={index}>
                {item}
                {index < firstLine.length - 1 && <span className="mx-2">|</span>}
              </span>
            ))}
          </div>
        )}
        {secondLine.length > 0 && (
          <div className="text-center mt-1">
            {secondLine.map((item, index) => (
              <span key={index}>
                {item}
                {index < secondLine.length - 1 && <span className="mx-2">|</span>}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
        <h2 className="font-bold tracking-wide border-b border-black pb-1 mb-3">{settings.sections.find(section => section.key === ResumeSectionKey.PERSONAL_INFO)?.label}</h2>
        <p>
         {data.personalInfo.summary}
        </p>
      </div>
      </div>
    )
  }

  const renderExperience = () => {
    return (
      <div className="mb-4">
        <SectionHeader label={settings.sections.find(section => section.key === "experience")?.label} sectionKey="experience" />
        <div className="space-y-4">
          {data.experience.map((job, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold">{job.role}</h3>
                  <p className='font-medium'>{job.dateRange}</p>
              </div>
              <p className=" mb-2 font-semibold">{job.company} {job.location ? ` | ${job.location}` : ''}</p>
              <ul>
                {job.achievements?.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderEducation = () => {
    return (
      <div className="mb-4">
        <SectionHeader label={settings.sections.find(section => section.key === "education")?.label} sectionKey="education" />
        <div className="space-y-3">
          {data.education?.map((edu, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="font-medium">{edu.dateRange}</p>
              </div>
              <p>{edu.institution}, {edu.grade ? `GPA: ${edu.grade}` : ''}</p>
              {edu.description && <p className="mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSkills = () => {
    return (
      <div className="mb-5">
        <SectionHeader label={settings.sections.find(section => section.key === "skills")?.label} sectionKey="skills" />
        <div className="space-y-2">
          {data.skills?.map((skillGroup, index) => (
            <div key={index}>
              <span className="font-bold ">{skillGroup.category ? `${skillGroup.category}: ` : ''}</span>
              <span className="">{Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderProjects = () => {
    return (
      <div className="mb-4">
        <SectionHeader label={settings.sections.find(section => section.key === "projects")?.label} sectionKey="projects" />
        <div className="space-y-3">
          {data.projects?.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold ">{project.name}</h3>
                  {project.link && <a href={project.link} className="block text-blue-500">Project Link</a>}
              </div>
              {project.achievements && project.achievements.length > 0 && (
                <ul>
                  {project.achievements?.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCertifications = () => {
    return (
      <div className="mb-5">
        <SectionHeader label={settings.sections.find(section => section.key === "certifications")?.label} sectionKey="certifications" />
        <div>
          {data.certifications?.map((cert, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                  <h3 className="font-bold ">{cert.name}, {cert.issuer}</h3>
                  <p className="font-medium">{cert.date}</p>
              </div>
              {cert.description && <p className="mt-[2px]">{cert.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderReferences = () => {
    return (
      <div className="mb-5">
        <SectionHeader label={settings.sections.find(section => section.key === "references")?.label} sectionKey="references" />
        <div className="space-y-2">
          {data.references?.map((ref, index) => {
            const refDetails = [ref.position, ref.company, ref.contact].filter(Boolean)
            return (
              <div key={index} className="mb-3">
                  <div className=" mb-1">
                      <h3 className="font-bold ">{ref.name}</h3>
                      {refDetails.length > 0 && (
                        <p className="font-medium">{refDetails.join(' | ')}</p>
                      )}
                    </div>
                {ref.description && <p className="mt-[2px]">{ref.description}</p>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCustomSections = () => {
    return (
      <div className="mb-5">
      {state.resumeEditingMode && (
        <div className="flex justify-end">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openForms("customSections")}
          className="h-6 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100">
          Edit Custom Sections
        </Button>
        </div>
      )}
        {data.customSections?.map((section, index) => (
          <div key={index} className="mb-5">
            {/* <SectionHeader label={section.label} sectionKey="customSections" /> */}
            <h2 className="font-bold tracking-wide border-b border-black pb-1 mb-3">{section.label}</h2>
            <div>
              {Array.isArray(section.content) ? (
                <ul className=" space-y-1">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
      <>
        {settings.sections
          ?.slice()
          .sort((a, b) => a.order - b.order)
          .map((section, index) => {
            if (section.visible) {
              switch (section.key) {
                case ResumeSectionKey.PERSONAL_INFO:
                  return <div key={index}>{renderPersonalInfo()}</div>
                case ResumeSectionKey.EXPERIENCE:
                  return <div key={index}>{renderExperience()}</div>
                case ResumeSectionKey.EDUCATION:
                  return <div key={index}>{renderEducation()}</div>
                case ResumeSectionKey.SKILLS:
                  return <div key={index}>{renderSkills()}</div>
                case ResumeSectionKey.PROJECTS:
                  return <div key={index}>{renderProjects()}</div>
                case ResumeSectionKey.CERTIFICATIONS:
                  return <div key={index}>{renderCertifications()}</div>
                case ResumeSectionKey.REFERENCES:
                  return <div key={index}>{renderReferences()}</div>
                case ResumeSectionKey.CUSTOM_SECTIONS:
                  return <div key={index}>{renderCustomSections()}</div>
                default:
                  return null
              }
            }
            return null
          })}
     </>
  )
}

export default ProfessionalTemplate