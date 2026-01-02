// Constants
export const TEMPLATES = [
    { id: "professional", name: "Professional"},
    { id: "modern", name: "Modern"},
    { id: "creative", name: "Creative"},
    // { id: "minimalist", name: "Minimalist"},
    // { id: "elegant", name: "Elegant"},
];

export const FONT_FAMILIES = [
    { value: "Lato", label: "Lato" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lora", label: "Lora" },
];

export const  ResumeSectionKey = {
    PERSONAL_INFO: "personalInfo",  // eg. "Summary"
    EXPERIENCE: "experience",  // eg. "Experience"
    EDUCATION: "education",  // eg. "Education"
    SKILLS: "skills",  // eg. "Skills"
    PROJECTS: "projects",  // eg. "Projects"
    CERTIFICATIONS: "certifications",  // eg. "Certifications"
    REFERENCES: "references",  // eg. "References"
    CUSTOM_SECTIONS: "customSections",  // eg. "Custom Sections"
} 


export const SUBSCRIPTION_PLAN = {
    FREE: "Free",
    STARTER: "Starter",
    PRO: "Pro",
}

export const SUBSCRIPTION_PLAN_LIMITS = {
    FREE: {
        chat: 20,
        resumes: 2,
        covers: 2,
        analyzerAndFeedback: 2,
        downloadsAndTemplates: 10,
        price: 0,
    },
    STARTER: {
        chat: 100,
        resumes: 50,
        covers: 50,
        analyzerAndFeedback: 50,
        downloadsAndTemplates: 1000,
        price: 7,
    },
    PRO: {
        chat: 1000,
        resumes: 200,
        covers: 200,
        analyzerAndFeedback: 100,
        downloadsAndTemplates: 1000,
        price: 14,
    },
}