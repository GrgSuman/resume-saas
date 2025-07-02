export type InitialStateType = {
    resumeData: ResumeData | null;
    resumeSettings: ResumeSettings | null;
    resumeTitle: string;
    isLoading: boolean;
    error: string | null;
    resumeDownloading: boolean;
    resumeEditingMode: boolean;
}

export type ResumeData = {
    personalInfo?: PersonalInfo
    education?: Education[]
    experience?: Experience[]
    projects?: Project[]
    skills?: SkillCategory[]
    certifications?: Certification[]
    references?: Reference[]
    interests?: string[]
    customSections?: CustomSection[]
}

export type Section = {
    key: string
    order: number
    visible: boolean
}

export type ResumeSettings = {
    fontSize?: number
    fontFamily?: string
    lineHeight?: number
    template?: string
    resumeTitle?: string
    sections?:Section[]
}

// Basic Information Types
export type PersonalInfo = {
  name?: string
  label?: string // e.g., "Full Stack Developer"
  email?: string
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
  institution?: string
  degree?: string
  description?: string
  startDate?: string
  endDate?: string
  grade?: string
}

// Work Experience Types
export type Experience = {
  company?: string
  role?: string
  startDate?: string
  endDate?: string
  location?: string
  achievements?: string[]
}

// Project Types
export type Project = {
  name?: string
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
  name?: string
  issuer?: string
  date?: string
  description?: string
}

// References Types
export type Reference = {
  name?: string
  position?: string
  company?: string
  contact?: string
  relationship?: string
}

// Custom Section Types
export type CustomSection = {
  title?: string
  content?: string 
}

