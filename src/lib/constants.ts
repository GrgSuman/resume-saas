export const API_URL = 'http://localhost:8000/api';
// export const API_URL = 'https://server.clonecv.com/api';

// Template Constants
export const TEMPLATES = {
  CREATIVE: "Creative",
  PROFESSIONAL: "Professional", 
  TWO_COLUMN: "Two Column"
} as const;

export type TemplateType = typeof TEMPLATES[keyof typeof TEMPLATES];