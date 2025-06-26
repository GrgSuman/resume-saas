import React, { createContext, useReducer, type Dispatch } from "react";
import { demoData } from "../../demo_data";
import type { ResumeData, ResumeMetaData, ResumeSettings } from "../../types/resumeDataType";

// Default data
const ResumeDefaultData: ResumeMetaData = {
    resumeData: demoData,
    resumeSettings: {
        fontSize: 13,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
        template: "Creative",
        resumeTitle: "My Professional Resume",
        sections: [
            { key: "personalInfo", order: 0, visible: true },
            { key: "experience", order: 1, visible: true },
            { key: "education", order: 2, visible: true },
            { key: "projects", order: 3, visible: true },
            { key: "skills", order: 4, visible: true },
            { key: "certifications", order: 5, visible: false },
            { key: "references", order: 6, visible: false },
            { key: "interests", order: 7, visible: true },
            { key: "customSections", order: 8, visible: false }
        ]
    },
    resumeDownloading: false,
    resumeEditingMode: true
};

// Action Types
export type ResumeAction = 
  | { type: 'RESUME_DATA'; payload: Partial<ResumeData> }
  | { type: 'RESUME_SETTINGS'; payload: Partial<ResumeSettings> }
  | { type: 'RESUME_DOWNLOADING'; payload: boolean }
  | { type: 'RESUME_EDITING_MODE'; payload: boolean };

// Context Type
type ResumeContextType = {
    state: ResumeMetaData;
    dispatch: Dispatch<ResumeAction>;
};

// Create context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Reducer function
const resumeReducer = (state: ResumeMetaData, action: ResumeAction): ResumeMetaData => {
    switch(action.type) {
        case 'RESUME_DATA':
            return { 
                ...state, 
                resumeData: { ...state.resumeData, ...action.payload } 
            };
        case 'RESUME_SETTINGS':
            return { 
                ...state, 
                resumeSettings: { ...state.resumeSettings, ...action.payload } 
            };
        case 'RESUME_DOWNLOADING':
            return { ...state, resumeDownloading: action.payload };
        case 'RESUME_EDITING_MODE':
            return { ...state, resumeEditingMode: action.payload };
        default:
            return state;
    }
};

// Context Provider component
export const ResumeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(resumeReducer, ResumeDefaultData);

    return (
        <ResumeContext.Provider value={{ state, dispatch }}>
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeContext;