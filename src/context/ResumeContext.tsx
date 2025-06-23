import  { createContext, useContext, useState } from "react";
import type { ResumeData } from "../types/resumeTypes";
import type { ReactNode } from "react";
import { demoData } from "../demo_data";

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(demoData);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
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