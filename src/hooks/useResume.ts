import { useContext } from "react";
import ResumeContext from "../context/resume/ResumeContext";

    // Custom hook for using the context
export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};