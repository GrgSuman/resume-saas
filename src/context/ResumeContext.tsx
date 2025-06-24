import  { createContext, useContext, useState } from "react";
import type { ResumeData } from "../types/resumeTypes";
import type { ReactNode } from "react";
import { demoData } from "../demo_data";

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  editResumeMode: boolean;
  setEditResumeMode: (mode: boolean) => void;
  resumeDownloading: boolean;
  setResumeDownloading: (downloading: boolean) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {

  // const [resumeData, dispatch] = useReducer(resumeReducer, demoData);
  const [resumeData, setResumeData] = useState(demoData);
  const [editResumeMode, setEditResumeMode] = useState(false);
  const [resumeDownloading, setResumeDownloading] = useState(false);
 

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, editResumeMode, setEditResumeMode,resumeDownloading,setResumeDownloading }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    alert("useResume must be used within a ResumeProvider");
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}; 