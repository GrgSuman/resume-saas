export interface Issues {
    issue: string;
    impact: string;
}

export interface Recommendations {
    action: string;
    example?: string;
    reason: string;
}

export interface SectionAnalysis {
    sectionKey: string;
    sectionName: string;
    score: number;
    status: "excellent" | "good" | "needs-improvement" | "critical";
    missingElements: string[];
    issues: Issues[];
    recommendations: Recommendations[];
}

export interface ResumeAnalysis {
    id: string;
    createdAt: string;
    summary: string;
    jobTitle?: string;
    atsScore: number;
    sectionAnalysis: SectionAnalysis[];
    overallInsights: string[];
    priorityActions: Array<{
        action: string;
        impact: string;
        section: string;
    }>;
    // Job matching fields - only present for tailored analyses
    jobDescription?: string;
    missingKeywords?: string[];
    jobMatchPercentage?: number;
}
