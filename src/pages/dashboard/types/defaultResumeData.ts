import { ResumeSectionKey } from "./constants";
import type { ResumeMetaData } from "./resume";

export const defaultResumeData: ResumeMetaData = {
    isResumeInitialized: false,
    messages: [],
    isTailoredResume: false,
    resumeTitle: "Alex Chen's Resume",
    jobDescription: "Full Stack MERN Developer",
    jobId: "",
    resumeError: null,
    resumeLoading: false,
    resumeDownloading: false,
    resumeEditingMode: false,
    resumeSettings: {
        fontSize: "13",
        fontFamily: "lato",
        lineHeight: "1.4",
        template: "classic",
        textAlignment: "left",
        sections: [
            { key: ResumeSectionKey.PERSONAL_INFO, label: "ProfessionalSummary", order: 1, visible: true },
            { key: ResumeSectionKey.EXPERIENCE, label: "Experience", order: 2, visible: true },
            { key: ResumeSectionKey.EDUCATION, label: "Education", order: 3, visible: true },
            { key: ResumeSectionKey.SKILLS, label: "Skills", order: 4, visible: true },
            { key: ResumeSectionKey.PROJECTS, label: "Projects", order: 5, visible: true },
            { key: ResumeSectionKey.CERTIFICATIONS, label: "Certifications", order: 6, visible: true },
            { key: ResumeSectionKey.REFERENCES, label: "References", order: 7, visible: true },
            { key: ResumeSectionKey.CUSTOM_SECTIONS, label: "Custom Sections", order: 8, visible: true },
        ]
    },
    resumeData: {
        personalInfo: {
            name: "Alex Chen",
            email: "alexchen@example.com",
            profession: "Full Stack MERN Developer",
            phone: "123-456-7890",
            address: "123 Main St, Anytown, USA",
            website: "https://alexchen.com",
            linkedin: "https://linkedin.com/in/alexchen",
            github: "https://github.com/alexchen",
            twitter: "https://twitter.com/alexchen",
            summary: "A full stack developer with a passion for building web applications using the MERN stack. I have a strong understanding of the MERN stack and am able to build web applications from scratch."
        },
        education: [],
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
        references: [],
        customSections: []
    }
};