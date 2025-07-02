// Main Resume Data Type
export type ResumeMetaData = {
    resumeData:ResumeData,
    resumeSettings:ResumeSettings
    resumeDownloading:boolean
    resumeEditingMode:boolean
}

export type ResumeSettings = {
    fontSize: number
    fontFamily: string
    lineHeight: number
    template: string
    resumeTitle: string
    sections:Section[]
}

export type Section = {
    key: string
    order: number
    visible: boolean
}

export type ResumeData = {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    projects?: Project[]
    skills: SkillCategory[]
    certifications?: Certification[]
    references?: Reference[]
    interests?: string[]
    customSections?: CustomSection[]
}

// Basic Information Types
export type PersonalInfo = {
  name: string
  label?: string // e.g., "Full Stack Developer"
  email: string
  phone?: string
  address?: string
  summary?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  portfolio?: string
}

// Education Types
export type Education = {
  institution: string
  degree?: string
  description?: string
  startDate?: string
  endDate?: string
  grade?: string
}

// Work Experience Types
export type Experience = {
  company: string
  role: string
  startDate?: string
  endDate?: string
  location?: string
  achievements?: string[]
}

// Project Types
export type Project = {
  name: string
  achievements?: string[]
  link?: string
}

// Skills Types
export type SkillCategory = {
  category?: string // e.g., "Languages", "Frameworks"
  items: string[]
}

// Awards / Certifications Types
export type Certification = {
  name: string
  issuer?: string
  date?: string
  description?: string
}

// References Types
export type Reference = {
  name: string
  position?: string
  company?: string
  contact?: string
  relationship?: string
}

// Custom Section Types
export type CustomSection = {
  title: string
  content: string 
}



// Default data
// const ResumeDefaultData: ResumeMetaData = {
//     resumeData: demoData,
//     resumeSettings: {
//         fontSize: 13,
//         fontFamily: "Arial, sans-serif",
//         lineHeight: 1.5,
//         template: "Creative",
//         resumeTitle: "My Professional Resume",
//         sections: [
//             { key: "personalInfo", order: 0, visible: true },
//             { key: "experience", order: 1, visible: true },
//             { key: "education", order: 2, visible: true },
//             { key: "projects", order: 3, visible: true },
//             { key: "skills", order: 4, visible: true },
//             { key: "certifications", order: 5, visible: false },
//             { key: "references", order: 6, visible: false },
//             { key: "interests", order: 7, visible: true },
//             { key: "customSections", order: 8, visible: false }
//         ]
//     },
//     resumeDownloading: false,
//     resumeEditingMode: true
// };
