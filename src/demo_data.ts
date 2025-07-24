import type { ResumeData } from "./context/resume/types";

export const demoData: ResumeData = {
  personalInfo: {
    name: "Alex Doe",
    label: "Full-Stack Developer",
    email: "alex.doe@example.com",
    phone: "123-456-7890",
    address: "123 Tech Street, Silicon Valley, CA 94105",
    summary: "Innovative Full-Stack Developer with 5+ years of experience in building and maintaining scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and solving complex problems.",
    website: "https://alexdoe.dev",
    linkedin: "https://linkedin.com/in/alexdoe",
    github: "https://github.com/alexdoe",
    portfolio: "https://alexdoe.dev/portfolio",
  },
  experience: [
    {
      company: "Tech Solutions Inc.",
      role: "Senior Software Engineer",
      startDate: "Jan 2021",
      endDate: "Present",
      location: "San Francisco, CA",
      achievements: [
        "Led the development of a new microservices architecture, improving system scalability by 40%.",
        "Mentored a team of 3 junior developers, improving team productivity by 25%.",
        "Reduced server response time by 30% by optimizing database queries and implementing caching strategies.",
      ],
    },
    {
      company: "Innovate LLC",
      role: "Software Developer",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      location: "Austin, TX",
      achievements: [
        "Developed and launched a customer-facing portal using React and Redux, serving over 100,000 users.",
        "Collaborated with the design team to create a responsive and accessible UI, resulting in a 15% increase in user engagement.",
        "Wrote and maintained comprehensive unit and integration tests, achieving 90% code coverage.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Master of Science",
      startDate: "2016",
      endDate: "2018",
      grade: "3.9/4.0 GPA",
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      achievements: [
        "Implemented a secure user authentication system with JWT.",
        "Designed a RESTful API for managing products, orders, and users.",
      ],
      link: "https://github.com/alexdoe/ecommerce-platform",
    },
    {
      name: "Real-time Chat Application",
      achievements: [
        "Utilized Socket.IO for low-latency, bidirectional communication.",
        "Built a clean and modern UI with React and Material-UI.",
      ],
      link: "https://github.com/alexdoe/chat-app",
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript (ES6+)", "TypeScript", "Python", "HTML5", "CSS3"],
    },
    {
      category: "Tools & Platforms",
      items: ["Docker", "AWS (EC2, S3)", "Git & GitHub", "CI/CD", "Webpack"],
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "Aug 2022",
    },
    {
      name: "Certified Kubernetes Application Developer (CKAD)",
      issuer: "The Linux Foundation",
      date: "May 2021",
    },
  ],
  interests: ["Open Source Contribution", "Hiking", "Photography", "Tech Meetups"],
  references: [
    {
      name: "John Doe",
      position: "Software Engineer",
      company: "Tech Solutions Inc.",
      contact: "john.doe@example.com",
      relationship: "Co-worker",
    },
  ],
  customSections: [
    {
      title: "Custom Section",
      content: "This is a custom section",
    },
  ],
};
