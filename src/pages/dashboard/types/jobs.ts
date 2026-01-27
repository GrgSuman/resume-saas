import type { QuestionWithAnswer } from "../jobs/components/Quiz";
export type Status = "Saved" | "Applied" | "Interviewing" | "Offer" | "Rejected" | "Archived";

export interface TimelineEntry {
  status: Status;
  note: string;
  date: string; // ISO string
}

export interface Document {
  documentId: string;
  type: "resume" | "coverLetter";
  title: string;
}

export interface Job {
  id?: string;
  title: string;
  companyName: string;
  companyUrl?: string;
  location: string;
  jobUrl?: string;
  jobType:string;
  status: Status;
  jobDescription: string;
  timeline: TimelineEntry[];
  resume?: Document;
  coverLetter?: Document;
  resumeQuestions?: QuestionWithAnswer[];
  coverLetterQuestions?: QuestionWithAnswer[];
  resumeStatus?: "IDLE" | "GENERATING" | "COMPLETED" | "FAILED";
  coverLetterStatus?: "IDLE" | "GENERATING" | "COMPLETED" | "FAILED";
  notes: string[];
  createdAt: string;
  updatedAt: string;
}