export function generatePlaceholderSVG(width: number, height: number, text: string, bgColor = "#1a1a1a", textColor = "#00ff41"): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}" stroke="${textColor}" stroke-width="2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="${textColor}" font-family="monospace" font-size="16">
        ${text}
      </text>
    </svg>
  `)}`;
}

export const placeholderImages = {
  "terminal-portfolio-1": generatePlaceholderSVG(800, 400, "Terminal Portfolio - Main Interface"),
  "terminal-portfolio-2": generatePlaceholderSVG(800, 400, "Terminal Portfolio - Command System"),
  "react-hooks-1": generatePlaceholderSVG(800, 400, "React Hooks - Component Lifecycle"),
  "react-hooks-2": generatePlaceholderSVG(800, 400, "React Hooks - Performance Patterns"),
  "typescript-1": generatePlaceholderSVG(800, 400, "TypeScript - Architecture Overview"),
  "typescript-2": generatePlaceholderSVG(800, 400, "TypeScript - Advanced Patterns"),
};
