import { ResumeSectionKey } from "./constants";
import type { ResumeMetaData } from "./resume";



export const defaultResumeData: ResumeMetaData = {
    resumeError: null,
    resumeLoading: false,
    resumeSettings:{
        fontSize: "13",
        fontFamily: "lato",
        lineHeight: "1.4",
        template: "classic",
        resumeTitle: "Alex Chen's Resume",
        sections: [
            { key: ResumeSectionKey.PERSONAL_INFO, label: "ProfessionalSummary", order: 1, visible: true },
            { key: ResumeSectionKey.EXPERIENCE, label: "Experience", order: 2, visible: true },
            { key: ResumeSectionKey.EDUCATION, label: "Education", order: 3, visible: true },
            { key: ResumeSectionKey.SKILLS, label: "Skills", order: 4, visible: true },
            { key: ResumeSectionKey.PROJECTS, label: "Projects", order: 5, visible: true },
            { key: ResumeSectionKey.CERTIFICATIONS, label: "Certifications", order: 6, visible: true },
            { key: ResumeSectionKey.REFERENCES, label: "References", order: 7, visible: true },
            { key: ResumeSectionKey.CUSTOM_SECTIONS, label: "Custom Sections", order: 8, visible: true },
        ]
    },
    resumeData:{
        personalInfo: {
            name: "Alex Chen",
            label: "Full Stack MERN Developer",
            email: "alex.chen@email.com",
            phone: "(415) 555-0123",
            address: "San Francisco, CA",
            linkedin: "linkedin.com/in/alexchen-dev",
            github: "github.com/alexchen-dev"
        },
        education: [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "San Francisco State University",
                dateRange: "August 2018 - May 2022",
                grade: "3.7/4.0",
                description: "Graduated with honors in Computer Science, completed a thesis on distributed systems and cloud computing."
            }
        ],
        experience: [
            {
                role: "Senior Full Stack Developer",
                company: "TechFlow Solutions",
                dateRange: "March 2022 - Present",
                location: "San Francisco, CA",
                achievements: [
                    "Led development of a real-time collaboration platform using React, Node.js, and Socket.io, serving 50,000+ concurrent users with 99.9% uptime",
                    "Architected and implemented RESTful APIs using Express.js and MongoDB, reducing API response time by 60% through query optimization and caching strategies",
                    "Built responsive frontend components using React hooks, Redux Toolkit, and Material-UI, improving user engagement by 35%",
                    "Implemented CI/CD pipelines using GitHub Actions and Docker, reducing deployment time from 2 hours to 15 minutes",
                    "Mentored 3 junior developers and established code review processes, improving code quality and reducing bugs by 40%"
                ]
            }
        ],
        skills: [
            {
                category: "Frontend Technologies",
                items: ["React.js", "Next.js", "Redux Toolkit", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Material-UI", "Chart.js"],
            },
            {
                category: "Backend Technologies",
                items: ["Node.js", "Express.js", "RESTful APIs", "GraphQL", "JWT Authentication", "Socket.io", "MongoDB", "Mongoose", "Redis", "PostgreSQL"],
            },
            {
                category: "DevOps & Tools",
                items: ["Docker", "AWS (EC2, S3, RDS)", "Git", "GitHub Actions", "Jest", "Cypress", "Postman", "VS Code", "Figma", "Agile/Scrum"],
            },
            {
                items:"Full Stack Development, Cloud Computing, DevOps, AI/ML, Cybersecurity",
            }
        ],
        projects: [
            {
                name: "TaskFlow - Project Management Platform",
                link: "https://taskflow-demo.vercel.app",
                achievements: [
                    "Built a comprehensive project management platform using React, Node.js, and MongoDB with real-time collaboration features",
                    "Implemented drag-and-drop task management, team chat, file sharing, and progress tracking with 4.8/5 user rating",
                    "Integrated payment processing with Stripe and deployed on AWS with auto-scaling capabilities",
                    "Used Socket.io for real-time updates and implemented advanced search with Elasticsearch"
                ]
            },
            {
                name: "EcoTrack - Environmental Monitoring App",
                link: "https://ecotrack-demo.netlify.app",
                achievements: [
                    "Developed a full-stack environmental monitoring application using MERN stack with IoT device integration",
                    "Created data visualization dashboards using D3.js and Chart.js for tracking air quality, temperature, and humidity",
                    "Implemented machine learning algorithms for predictive analysis and automated alert systems",
                    "Built mobile-responsive PWA with offline capabilities and push notifications"
                ]
            },
            {
                name: "DevConnect - Developer Networking Platform",
                link: "https://devconnect-social.herokuapp.com",
                achievements: [
                    "Designed and developed a social networking platform for developers using React, Express.js, and MongoDB",
                    "Implemented features like profile management, project showcase, job board, and real-time messaging",
                    "Integrated GitHub API for automatic project import and LinkedIn OAuth for seamless authentication",
                    "Optimized for SEO and implemented advanced filtering and recommendation algorithms"
                ]
            }
        ],
        certifications: [
            {
                name: "AWS Certified Developer - Associate",
                issuer: "Amazon Web Services",
                date: "2023-2026",
                description: "Certified in developing and maintaining applications on AWS platform"
            },
            {
                name: "MongoDB Certified Developer",
                issuer: "MongoDB University",
                date: "2022-2025",
                description: "Expertise in MongoDB database design, development, and optimization"
            },
            {
                name: "React Developer Certification",
                issuer: "Meta (Facebook)",
                date: "2022-2025",
                description: "Advanced React.js development including hooks, context, and performance optimization"
            }
        ],
        references: [
            {
                name: "Sarah Johnson",
                position: "Engineering Manager",
                company: "TechFlow Solutions",
                contact: "sarah.johnson@techflow.com",
                description: "Direct supervisor for 2 years, can speak to leadership and technical skills"
            },
            {
                name: "Michael Rodriguez",
                position: "Senior Developer",
                company: "StartupHub Inc.",
                contact: "michael.rodriguez@startuphub.com",
                description: "Former colleague and team lead, worked together on multiple projects"
            }
        ],
        customSections: [
            {
                label: "Open Source Contributions",
                content: [
                    "Contributor to React.js core library with 500+ GitHub stars on personal projects",
                    "Maintainer of popular npm packages with 10,000+ weekly downloads",
                    "Active participant in Stack Overflow with 2,000+ reputation points"
                ],
                isListMode: true
            },
            {
                label: "Technical Blog",
                content: "Regular contributor to Medium and Dev.to, writing about MERN stack development, best practices, and emerging technologies. Articles have been featured in JavaScript Weekly and React Status newsletters.",
                isListMode: false
            }
        ]
    },
    resumeDownloading: false,
    resumeEditingMode: false,
};