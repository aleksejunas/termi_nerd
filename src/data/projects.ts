
export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  technologies: string[];
  images: string[];
  challenges: string;
  liveUrl?: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    title: 'Project Alpha',
    slug: 'project-alpha',
    description: 'A cool app.',
    longDescription:
      'Project Alpha is a full-stack application designed to showcase modern web development practices. It features a reactive UI, real-time database updates with Supabase, and a robust backend. The goal was to build a scalable and maintainable application from the ground up.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'],
    images: [
        "/placeholder/photo-1486312338219-ce68d2c6f44d.jpg",
        "/placeholder/photo-1461749280684-dccba630e2f6.jpg",
        "/placeholder/photo-1531297484001-80022131f5a1.jpg",
    ],
    challenges: "One of the main challenges was integrating Supabase real-time features with React's state management, ensuring a seamless and responsive user experience. Another hurdle was optimizing the database queries for performance as the application scaled.",
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    title: 'Project Beta',
    slug: 'project-beta',
    description: 'Another cool app.',
    longDescription:
      'Project Beta explores the possibilities of data visualization using D3.js and React. It fetches complex datasets and renders them into interactive charts and graphs, providing users with insightful analytics. This project honed my skills in handling large amounts of data on the client-side.',
    technologies: ['React', 'D3.js', 'TanStack Query', 'Node.js'],
    images: [
        "/placeholder/photo-1498050108023-c5249f4df085.jpg",
        "/placeholder/photo-1581091226825-a6a2a5aee158.jpg",
    ],
    challenges: "The primary challenge in Project Beta was performance optimization. Rendering thousands of data points with D3.js while maintaining a smooth user interface required careful handling of React component lifecycle methods and virtualization techniques.",
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    title: 'Project Gamma',
    slug: 'project-gamma',
    description: 'You guessed it, cool.',
    longDescription:
      'This project is a command-line interface (CLI) tool built with Node.js for automating development workflows. It includes features like project scaffolding, code generation, and deployment scripts, significantly speeding up the development process for repetitive tasks.',
    technologies: ['Node.js', 'TypeScript', 'Commander.js', 'Inquirer.js'],
    images: [
        "/placeholder/photo-1488590528505-98d2b5aba04b.jpg",
        "/placeholder/photo-1649972904349-6e44c42644a7.jpg",
    ],
    challenges: "Building a flexible and extensible plugin system for the CLI was a significant architectural challenge. It required a deep understanding of Node.js modules and dynamic imports to allow for easy extensibility by other developers.",
    repoUrl: '#',
  },
];
