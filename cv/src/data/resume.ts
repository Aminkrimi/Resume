/*
 * All résumé content lives here. Components only render this data,
 * so editing the CV never means touching markup.
 */

export type ContactKind = 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'portfolio';

export interface Contact {
  kind: ContactKind;
  label: string;
  href?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Job {
  title: string;
  company: string;
  note?: string;
  period: string;
  points: string[];
}

export interface Project {
  name: string;
  type: string;
  impact?: string;
  stack: string[];
}

export interface Degree {
  degree: string;
  field: string;
  period: string;
  detail?: string;
}

export interface Highlight {
  value: string;
  label: string;
}

export const resume = {
  name: 'Amin Karimi',
  role: 'Front-End Engineer',
  focus: ['React', 'TypeScript', 'Next.js'],
  statement: 'Building scalable, maintainable, and user-focused web applications with modern frontend technologies.',

  contacts: [
    { kind: 'email', label: 'm.amiin.krimi@gmail.com', href: 'mailto:m.amiin.krimi@gmail.com' },
    { kind: 'phone', label: '+98 939 189 9523', href: 'tel:+989391899523' },
    { kind: 'location', label: 'Tehran, Iran' },
    // TODO: confirm the LinkedIn handle before sending the CV out.
    { kind: 'linkedin', label: 'linkedin.com/in/aminkrimi', href: 'https://www.linkedin.com/in/aminkrimi' },
    { kind: 'github', label: 'github.com/Aminkrimi', href: 'https://github.com/Aminkrimi' },
    { kind: 'portfolio', label: 'aminkrimi.github.io/Resume', href: 'https://aminkrimi.github.io/Resume/en/' },
  ] satisfies Contact[],

  skills: [
    {
      title: 'Frontend',
      items: [
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Shadcn UI',
        'Redux', 'Zustand', 'React Query', 'TanStack Table', 'Framer Motion',
      ],
    },
    { title: 'Backend / Integration', items: ['REST API', 'API Integration', 'Authentication', 'State Management'] },
    { title: 'Libraries', items: ['React Hook Form', 'Zod', 'Radix UI', 'Nuqs', 'Sonner'] },
    { title: 'Tools', items: ['Git', 'GitLab', 'Docker', 'Vite', 'ESLint', 'Prettier', 'VS Code'] },
  ] satisfies SkillGroup[],

  strengths: [
    'Clean Code Architecture',
    'Component Design',
    'Performance Optimization',
    'Problem Solving',
    'Team Collaboration',
    'Continuous Learning',
    'Product Thinking',
  ],

  summary:
    'Front-End Engineer with 4+ years of experience building scalable and user-focused web applications using React, TypeScript, and modern frontend technologies. Experienced in designing reusable component systems, integrating complex APIs, improving application performance, and delivering production-ready products. Passionate about clean architecture, modern UI development, and creating impactful user experiences.',

  experience: [
    {
      title: 'Front-End Engineer',
      company: 'Test Sho',
      note: 'Largest Project',
      period: '2022 – Present',
      points: [
        'Developed and maintained complex production-level frontend applications using React, TypeScript, and Vite.',
        'Built reusable component systems and scalable UI architecture.',
        'Integrated REST APIs and managed complex application states.',
        'Improved user experience, performance, and maintainability.',
        'Collaborated with cross-functional teams to deliver product features.',
      ],
    },
    {
      title: 'Front-End Developer',
      company: 'Ordibehesht',
      period: '2021 – 2022',
      points: [
        'Developed responsive web applications using the React ecosystem.',
        'Created reusable UI components.',
        'Improved frontend architecture and user experience.',
      ],
    },
    {
      title: 'Front-End Developer',
      company: 'Karaj Municipality',
      period: '2020 – 2021',
      points: [
        'Built internal web applications.',
        'Integrated backend services through REST APIs.',
        'Improved usability and application performance.',
      ],
    },
  ] satisfies Job[],

  projects: [
    {
      name: 'Test Sho',
      type: 'Large-Scale E-commerce Platform',
      impact: 'Production application with complex business logic.',
      stack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'React Query', 'TanStack Table'],
    },
    {
      name: 'Marketing Campaign System (IMP)',
      type: 'Internal Marketing Management Platform',
      stack: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS'],
    },
    {
      name: 'Laboratory Management System (IMP)',
      type: 'Healthcare Management Platform',
      stack: ['React', 'TypeScript', 'React Query', 'Zod'],
    },
    {
      name: 'Ordibehesht',
      type: 'Business Management Platform',
      stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    },
  ] satisfies Project[],

  education: [
    { degree: 'MSc', field: 'Artificial Intelligence and Soft Computing', period: '2023 – 2025', detail: 'GPA: 17 / 20' },
    { degree: 'BSc', field: 'Computer Engineering', period: '2018 – 2022' },
  ] satisfies Degree[],

  highlights: [
    { value: '4+', label: 'Years Experience' },
    { value: '5+', label: 'Production Projects' },
    { value: 'React', label: 'Ecosystem Expert' },
    { value: 'AI & ML', label: 'Academic Background' },
  ] satisfies Highlight[],

  motto: 'Building products, not just interfaces.',
};
