// export const API_URL = 'http://localhost:8000/api';
export const API_URL = 'https://server.clonecv.com/api';

// Template Constants
export const TEMPLATES = {
  CREATIVE: "Creative",
  PROFESSIONAL: "Professional", 
  TWO_COLUMN: "Two Column"
} as const;

export const CREDIT_COSTS = {
  CREATE_RESUME: 3,
  CLONE_RESUME: 2,
  AI_CONVERSATION: 1,
  DOWNLOAD_PDF: 2,
  EXPORT_TO_DOCX: 3,
  AI_OPTIMIZATION_AND_ATS_CHECKER: 3
}

export type TemplateType = typeof TEMPLATES[keyof typeof TEMPLATES];
