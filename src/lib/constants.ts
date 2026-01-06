// export const API_URL = 'http://localhost:8000/api';
export const API_URL = 'https://server.clonecv.com/api';

// Template Constants
export const TEMPLATES = {
  CREATIVE: "Creative",
  PROFESSIONAL: "Professional",
  MODERN: "Modern",
  TWO_COLUMN: "Two Column",
  MINIMALIST: "Minimalist",
  ELEGANT: "Elegant",
  EXECUTIVE: "Executive",
  CLASSIC: "Classic",
  BOLD: "Bold",
  INNOVATIVE: "Innovative",
  CLEAN: "Clean",
  CORPORATE: "Corporate",
  CONTEMPORARY: "Contemporary",
  VISION: "Vision",
  FOCUS: "Focus"
} as const;


// Font Constants
export const FONTS = {
  "Roboto": "Roboto, sans-serif",
  "Open Sans": "Open Sans, sans-serif",
  "PT Serif": "PT Serif, serif",
  "Lora": "Lora, serif"
} as const;

// Type for font values
export type FontName = keyof typeof FONTS;

// Dropdown options
export const FONT_OPTIONS = Object.entries(FONTS).map(([key, value]) => ({
  id: key,
  name: key,
  css: value
}));

// Billing model: Most features are FREE, only these are paid:
export const PAID_FEATURES = {
  AI_CONVERSATION: 1, // per 5 messages
  CREATE_COVER_LETTER: 1, // per cover letter
  AI_TAILORED_RESUME: 1, // per AI-tailored resume
}

// FREE features (no charges):
// - Resume builder (creation, editing, cloning)
// - Resume downloads (PDF, DOCX)
// - AI optimization & ATS checker
// - All templates and customization
// - Job tracking (unlimited)

export const SECTION_LABELS = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  references: "References",
  interests: "Interests",
}
export type SectionLabel = keyof typeof SECTION_LABELS;

  // A4 dimensions in pixels (at 96 DPI: 210mm = 794px, 297mm = 1123px)
  export const A4_WIDTH = 794;
  export const A4_HEIGHT = 1123;
  export const PADDING = 28;
  export const CONTENT_HEIGHT = A4_HEIGHT - (PADDING * 2);

export type TemplateType = typeof TEMPLATES[keyof typeof TEMPLATES];
