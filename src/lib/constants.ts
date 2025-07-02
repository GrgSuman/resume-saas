export const API_URL = 'http://localhost:8000/api';

// Template Constants
export const TEMPLATES = {
  CREATIVE: "Creative",
  PROFESSIONAL: "Professional", 
  TWO_COLUMN: "Two Column"
} as const;

export type TemplateType = typeof TEMPLATES[keyof typeof TEMPLATES];