import { ResumeSectionKey } from "./constants"
import type { ResumeAnalysis } from "./resumeAnalysis"
import type { Message } from "../resume/resume-detail/chats/MarkdownMessage"

// Generation status for tailored resumes
export type GenerationStatus = "IDLE" | "GENERATING" | "COMPLETED"

// Main Resume Data Type
export type ResumeMetaData = {
    resumeData:ResumeData,
    resumeSettings:ResumeSettings
    resumeAnalysis?:ResumeAnalysis[]
    resumeDownloading:boolean
    resumeEditingMode:boolean
    resumeError:string | null
    resumeLoading:boolean
    jobDescription:string
    resumeTitle:string
    isResumeInitialized:boolean
    messages:Message[],
    jobId?:string,
    isTailoredResume:boolean,
    creationType: "scratch" | "jobTitle" | "upload" | "tailored"
    userData: string

}

// Resume Settings Type
export type ResumeSettings = {
    fontSize: string  //10-18
    fontFamily: string
    lineHeight: string //1.2-1.8
    template: string //classic, modern, minimal, etc.
    textAlignment: 'left' | 'center' | 'right' | 'justify'
    sections:Section[],
}

// Section Type
export type Section = {
    key: typeof ResumeSectionKey[keyof typeof ResumeSectionKey] //eg. "summary", "experience", "education", "skills", "projects", "certifications", "references", "customSections", etc.
    label: string //eg. To be shown in resume as Summary, Experience, Education, Skills, Projects, etc.
    order: number
    visible: boolean
    skillsMode?: 'categorized' | 'simple' // For skills section
}

export type AchievementItem = {
  order: number,
  content: string,
};

// Resume Data Type
export type ResumeData = {
    personalInfo: PersonalInfo
    education: Education[]
    experience: Experience[]
    projects: Project[]
    skills: SkillCategory[]
    certifications: Certification[]
    references: Reference[]
    customSections: CustomSection[]
}

// Personal Info Type
export type PersonalInfo = {
  profilePicture?: string
  name: string
  profession?: string // e.g., "Full Stack Developer"
  email: string
  phone?: string
  address?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  summary?: string
}

// Education Types
export type Education = {
  order: number,
  institution: string
  degree: string
  dateRange: string //eg. "2021-2025"
  grade?: string //eg. "3.8/4.0"
  description?: string
}

// Work Experience Types
export type Experience = {
  order: number,
  company: string
  role: string //eg. "Software Engineer", "Full Stack Developer", etc.
  dateRange: string //eg. "2021-2025"
  location?: string //eg. "San Francisco, CA", "New York, NY", etc.
  achievements: AchievementItem[] //eg. ["Architected and developed microservices platform serving 100,000+ daily active users, resulting in 40% performance improvement"], ["Led cross-functional team of 5 developers in implementing CI/CD pipelines using Docker and Kubernetes, reducing deployment time by 60%"], ["Mentored 3 junior developers and established code review processes, improving code quality by 35%"], ["Optimized database queries and implemented caching strategies, reducing API response time from 500ms to 200ms"], ["Collaborated with product managers to deliver 15+ features on time and within budget"]
}

// Project Types
export type Project = {
  order: number,
  name: string
  achievements: AchievementItem[]
  link?: string
}

// Skills Types
export type SkillCategory = {
  order: number,
  categoryName: string,
  items: AchievementItem[]
}

// Awards / Certifications Types
export type Certification = {
  order: number,
  name: string
  issuer?: string
  date?: string
  description?: string
}

// References Types
export type Reference = {
  order: number,
  name: string
  position?: string
  company?: string
  contact?: string
  description?: string
}

// Custom Section Types
export type CustomSection = {
  order: number,
  name: string,
  achievements: AchievementItem[]
}

