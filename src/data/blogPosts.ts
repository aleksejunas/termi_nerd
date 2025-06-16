export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building a Modern Terminal Portfolio',
    date: '2024-01-15',
    excerpt: 'How I created a terminal-inspired portfolio using React, TypeScript, and modern web technologies.',
    readTime: '5 min read',
    slug: 'building-modern-terminal-portfolio',
    tags: ['React', 'TypeScript', 'Portfolio', 'Terminal'],
    content: `# Building a Modern Terminal Portfolio

When I decided to create a new portfolio, I wanted something that would stand out from the typical web developer portfolios. As someone who spends most of their time in the terminal, I thought: why not bring that experience to the web?

![Terminal Portfolio Interface](/images/terminal-portfolio.png)

## The Concept

The idea was simple: create a portfolio that feels like using a real terminal, but with the polish and interactivity that modern web technologies can provide. This meant:

- **Authentic terminal aesthetics** with monospace fonts and a dark theme
- **Command-line interface** for navigation and interaction
- **Responsive design** that works on all devices
- **Modern web technologies** under the hood

## Technology Stack

For this project, I chose a modern stack that would give me the flexibility and performance I needed:

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

### UI Components
- **Radix UI** for accessible, unstyled components
- **Lucide React** for consistent icons
 
## Key Features

### Command System
The heart of the portfolio is the command system. Users can type commands like:
- \`help\` - Show available commands
- \`about\` - Display information about me
- \`projects\` - List my projects
- \`skills\` - Show my technical skills
- \`contact\` - Get my contact information

### Auto-completion
Just like a real terminal, the portfolio includes tab completion for commands, making it intuitive for users familiar with command-line interfaces.

### Command History
Users can navigate through their command history using the up and down arrow keys, just like in a real terminal.

## Conclusion

Building this terminal portfolio was an exciting project that combined my love for command-line interfaces with modern web development. It's a unique way to showcase skills while providing an engaging user experience.

The result is a portfolio that's both functional and memorable, demonstrating technical skills while offering visitors an interactive experience they won't forget.`
  },
  {
    id: "2",
    title: "Mastering React Hooks: Advanced Patterns",
    date: "2024-01-10",
    excerpt: "Deep dive into advanced React Hook patterns and custom hooks for building scalable applications.",
    readTime: "8 min read",
    slug: "mastering-react-hooks-advanced-patterns",
    tags: ["React", "Hooks", "JavaScript", "Best Practices"],
    content: `# Mastering React Hooks: Advanced Patterns

React Hooks revolutionized how we write React components, but there's much more to them than just \`useState\` and \`useEffect\`. Let's explore advanced patterns that will make your React code more maintainable and powerful.

## Custom Hooks: Beyond the Basics

Custom hooks are where the real power of React Hooks shines. They allow you to extract component logic into reusable functions.

## Performance Optimization with Hooks

### useMemo and useCallback
These hooks are crucial for preventing unnecessary re-renders.

## Best Practices

1. **Keep hooks at the top level** - Never call hooks inside loops, conditions, or nested functions
2. **Use the dependency array correctly** - Include all values from component scope that are used inside the effect
3. **Extract custom hooks** - When you have complex logic that's used in multiple places
4. **Use TypeScript** - Get better IntelliSense and catch errors early

## Conclusion

React Hooks provide a powerful way to manage state and side effects in functional components. By mastering these advanced patterns, you'll be able to write more maintainable and performant React applications.`
  },
  {
    id: "3",
    title: "TypeScript Best Practices for Large Applications",
    date: "2024-01-05",
    excerpt: "Essential TypeScript patterns and practices for maintaining large-scale applications.",
    readTime: "6 min read",
    slug: "typescript-best-practices-large-applications",
    tags: ["TypeScript", "Best Practices", "Architecture", "Scalability"],
    content: `# TypeScript Best Practices for Large Applications

As applications grow in size and complexity, TypeScript becomes increasingly valuable. Here are the essential patterns and practices that will help you maintain clean, scalable TypeScript code.

## Strict Type Configuration

Start with a strict TypeScript configuration to catch errors early.

## Advanced Type Patterns

TypeScript provides powerful utility types for common transformations.

## Organizing Types

Organize types by domain rather than by technical concerns.

## Conclusion

TypeScript's type system is incredibly powerful, but with great power comes great responsibility. By following these best practices, you'll be able to build large applications that are both type-safe and maintainable.`
  }
];
