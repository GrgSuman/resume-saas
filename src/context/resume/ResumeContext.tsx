import React, { createContext, useEffect, useReducer, type Dispatch } from "react";
import { useParams } from "react-router";
import axiosInstance from "../../api/axios";
import type { InitialStateType, ResumeData, ResumeSettings } from "./types";


const initialState: InitialStateType = {
    resumeData: null,
    resumeSettings: null,
    resumeDownloading: false,
    resumeEditingMode: true,
    resumeTitle: "",
    isLoading: true,
    error: null,
    isInitialized: false
}

// Action Types
export type ResumeAction = 
  // Loading and error states
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null } 

  // Initial load
  | { type: 'INITIALIZE_RESUME'; payload: { resumeData: ResumeData; resumeSettings: ResumeSettings; resumeTitle: string } }
  
  // Data updates
  | { type: 'UPDATE_RESUME_DATA'; payload: Partial<ResumeData> }
  | { type: 'UPDATE_RESUME_SETTINGS'; payload: Partial<ResumeSettings> }
  | { type: 'SET_RESUME_TITLE'; payload: string }
  
  // UI states
  | { type: 'SET_DOWNLOADING'; payload: boolean }
  | { type: 'SET_EDITING_MODE'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }


// Context Type
type ResumeContextType = {
    state: InitialStateType;
    dispatch: Dispatch<ResumeAction>;
};

// Create context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);


// Reducer function
const resumeReducer = (state: InitialStateType, action: ResumeAction) => {
    switch(action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'INITIALIZE_RESUME':
            return { 
                ...state,
                resumeData: action.payload.resumeData, 
                resumeSettings: action.payload.resumeSettings,
                resumeTitle: action.payload.resumeTitle
            };
        
        case 'SET_RESUME_TITLE':
            return { ...state, isInitialized: true, resumeTitle: action.payload };

        case 'UPDATE_RESUME_DATA':
            return { ...state, isInitialized: true, resumeData: { ...state.resumeData, ...action.payload } };

        case 'UPDATE_RESUME_SETTINGS':
            return { ...state, isInitialized: true, resumeSettings: { ...state.resumeSettings, ...action.payload } };

        case 'SET_DOWNLOADING':
            return { ...state, resumeDownloading: action.payload };

        case 'SET_EDITING_MODE':
            return { ...state, resumeEditingMode: action.payload };

        case 'SET_INITIALIZED':
            return { ...state, isInitialized: action.payload };

        default:
            return state;
    }
};

const updateResume = async (id: string, resumeData?: ResumeData, resumeSettings?: ResumeSettings, title?: string | null) => {
    try {
        const payload: {resumeData?: ResumeData, resumeSettings?: ResumeSettings, title?: string | null} = {};
        if (resumeData !== undefined) payload.resumeData = resumeData;
        if (resumeSettings !== undefined) payload.resumeSettings = resumeSettings;
        if (title !== undefined && title !== null) payload.title = title;
        await axiosInstance.patch(`/resume/${id}`, payload);
    } catch (error) {
        console.error('Error updating resume:', error);
    }
};

// Context Provider component
export const ResumeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(resumeReducer, initialState);
    const {id} = useParams()

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axiosInstance.get(`/resume/${id}`);
                dispatch({type: 'INITIALIZE_RESUME', payload: {resumeData: response.data.resume.resumeData, resumeSettings: response.data.resume.resumeSettings, resumeTitle: response.data.resume.title}});
                dispatch({type: 'SET_LOADING', payload: false});
            } catch (error) {
                console.error('Error fetching resume:', error);
            }
        }
        if(id){
            fetchResume();
        }
    }, [id])

    useEffect(()=>{
        if(id && state.resumeData && state.resumeSettings && state.isInitialized){
            updateResume(id, state.resumeData, state.resumeSettings)
        }
    }, [id, state.resumeData, state.resumeSettings, state.isInitialized])

    useEffect(() => {
        if (id && state.resumeTitle && state.isInitialized) {
            const handler = setTimeout(() => {
                updateResume(id, undefined, undefined, state.resumeTitle);
            }, 1000);

            return () => clearTimeout(handler);
        }
    }, [id, state.resumeTitle, state.isInitialized]);

    return (
        <ResumeContext.Provider value={{ state, dispatch }}>
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeContext;