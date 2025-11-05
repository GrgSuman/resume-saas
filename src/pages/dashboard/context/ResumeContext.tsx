import React, { createContext, useEffect, useReducer,  useRef,  type Dispatch } from "react";
import type { ResumeMetaData, ResumeSettings, ResumeData } from "../types/resume";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../../api/axios";
import { AxiosError } from "axios";
import { defaultResumeData } from "../types/defaultResumeData";

const initialState: ResumeMetaData={
    resumeData: defaultResumeData.resumeData,
    resumeSettings: defaultResumeData.resumeSettings,
    resumeDownloading: false,
    resumeEditingMode: false,
    resumeError: null,
    resumeLoading: true,
    resumeTitle: defaultResumeData.resumeTitle,
    jobDescription: '',
}

// Action Types
export type ResumeAction = 
  // Loading and error states
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null } 

  | { type: 'SET_RESUME_TITLE'; payload: string }

  // Job descriptions
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }

  // Initial load
  | { type: 'INITIALIZE_RESUME_DATA'; payload: { resumeData: ResumeData; resumeSettings: ResumeSettings; resumeTitle: string; jobDescription: string }}
  
  // Data updates
  | { type: 'UPDATE_RESUME_DATA'; payload: Partial<ResumeData> }
  | { type: 'UPDATE_RESUME_SETTINGS'; payload: Partial<ResumeSettings> }
  
  // UI states
  | { type: 'SET_DOWNLOADING'; payload: boolean }
  | { type: 'SET_EDITING_MODE'; payload: boolean }
// Context Type
type ResumeContextType = {
    state: ResumeMetaData;
    dispatch: Dispatch<ResumeAction>;
};

// Create context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Reducer function
const resumeReducer = (state: ResumeMetaData | null, action: ResumeAction) => {
    if (!state) {
        return initialState;
    }
    switch(action.type) {
        case 'SET_LOADING':
            return { ...state, resumeLoading: action.payload };
        
        case 'SET_ERROR':
            return { ...state, resumeError: action.payload };

        case 'SET_DOWNLOADING':
            return { ...state, resumeDownloading: action.payload };

        case 'SET_EDITING_MODE':
            return { ...state, resumeEditingMode: action.payload };

        case 'SET_RESUME_TITLE':
            return { ...state, resumeTitle: action.payload };
        
        case 'SET_JOB_DESCRIPTION':
            return { ...state, jobDescription: action.payload };

        case 'INITIALIZE_RESUME_DATA':
            return { ...state, resumeTitle: action.payload.resumeTitle, resumeData: action.payload.resumeData, resumeSettings: action.payload.resumeSettings, jobDescription: action.payload.jobDescription };

        case 'UPDATE_RESUME_DATA':
            return { ...state,resumeData: { ...state.resumeData, ...action.payload } };

        case 'UPDATE_RESUME_SETTINGS':
            return { ...state, resumeSettings: { ...state.resumeSettings, ...action.payload } };

        default:
            return state;
    }
};


// Context Provider component
export const ResumeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const {id} = useParams()
    const [state, dispatch] = useReducer(resumeReducer, initialState);
    const navigate = useNavigate()

    // fetch resume
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axiosInstance.get(`/resume/${id}`);
                dispatch({type: 'INITIALIZE_RESUME_DATA', payload: {resumeData: response.data.resume.resumeData,
                     resumeSettings: response.data.resume.resumeSettings,
                      resumeTitle: response.data.resume.title,
                      jobDescription: response.data.resume.jobDescription
                }});
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error.response?.status === 404){
                        return navigate('/dashboard')
                    }
                }
            }
            finally{
                hasInitialized.current = true;
                dispatch({type: 'SET_LOADING', payload: false});
            }
        }
        if(id){
            fetchResume();
        }
    }, [id, navigate])

    const hasInitialized = useRef(false);

    // update resume
    useEffect(() => {
        if (!id || !hasInitialized.current) return

        //Set up debounce
        const debounceTimer = setTimeout(() => {
            updateResume(id, state?.resumeData, state?.resumeSettings, state?.resumeTitle, state?.jobDescription);
        }, 1000); // waits 1s after the last change

        //cleanup previous timeout when dependencies change
        return () => clearTimeout(debounceTimer);
    }, [state?.resumeData, state?.resumeSettings, id,state?.resumeTitle, state?.jobDescription])


    const updateResume = async (id: string, resumeData?: ResumeData, resumeSettings?: ResumeSettings, title?: string | null, jobDescription?: string | null) => {
        try {
            const payload: {resumeData?: ResumeData, resumeSettings?: ResumeSettings, title?: string | null, jobDescription?: string | null} = {};
            if (resumeData !== undefined) payload.resumeData = resumeData;
            if (resumeSettings !== undefined) payload.resumeSettings = resumeSettings;
            if (title !== undefined && title !== null) payload.title = title;
            if (jobDescription !== undefined && jobDescription !== null) payload.jobDescription = jobDescription;
            await axiosInstance.patch(`/resume/${id}`, payload);
        } catch (error) {
            console.error('Error updating resume:', error);
        }
    };

    return (
        <ResumeContext.Provider value={{ state, dispatch }}>
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeContext;