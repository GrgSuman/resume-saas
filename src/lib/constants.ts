// export const API_URL = 'http://localhost:8000/api';
export const API_URL = 'https://server.clonecv.com/api';

// Template Constants
export const TEMPLATES = {
  CREATIVE: "Creative",
  PROFESSIONAL: "Professional", 
  MODERN: "Modern",
  TWO_COLUMN: "Two Column"
} as const;

export const CREDIT_COSTS = {
  CREATE_RESUME: 3,
  CLONE_RESUME: 2,
  AI_CONVERSATION: 1,
  DOWNLOAD_PDF: 2,
  EXPORT_TO_DOCX: 3,
  AI_OPTIMIZATION_AND_ATS_CHECKER:3
}

  // A4 dimensions in pixels (at 96 DPI: 210mm = 794px, 297mm = 1123px)
  export const A4_WIDTH = 794;
  export const A4_HEIGHT = 1123;
  export const PADDING = 28;
  export const CONTENT_HEIGHT = A4_HEIGHT - (PADDING * 2);

export type TemplateType = typeof TEMPLATES[keyof typeof TEMPLATES];
