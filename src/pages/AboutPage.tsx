import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

const toolCategories = [
  {
    category: "Hardware",
    items: [
      { name: "MacBook Pro", description: "My primary machine for development and creative work." },
      { name: "Dell UltraSharp Monitor", description: "For that crucial extra screen real estate." },
    ],
    image: "/placeholder/photo-1486312338219-ce68d2c6f44d.jpg"
  },
  {
    category: "Software & Editors",
    items: [
      { name: "Visual Studio Code", description: "Lightweight, powerful, and endlessly customizable." },
      { name: "iTerm2 with Zsh", description: "A terminal setup that's a joy to use." },
    ],
    image: "/placeholder/photo-1461749280684-dccba630e2f6.jpg"
  },
  {
    category: "Design",
    items: [
      { name: "Figma", description: "For all things UI/UX design and team collaboration." },
      { name: "Adobe Photoshop", description: "The industry standard for photo editing and manipulation." },
    ],
    image: "/placeholder/photo-1487058792275-0ad4aaf24ca7.jpg"
  },
  {
    category: "Services & Infrastructure",
    items: [
      { name: "Vercel", description: "Seamless hosting and deployment for frontend projects." },
      { name: "Supabase", description: "My go-to Backend-as-a-Service for projects big and small." },
      { name: "GitHub", description: "For version control, collaboration, and code hosting." },
    ],
    image: "/placeholder/photo-1518770660439-4636190af475.jpg"
  }
];

const AboutPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">About Me</h1>
      <p className="text-lg text-muted-foreground mb-12">
        I'm a passionate full-stack developer with a love for creating beautiful and functional web applications. I thrive on solving complex problems and turning ideas into reality. Below are some of the tools and technologies I use to bring my projects to life.
      </p>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-shrink-0 bg-primary text-primary-foreground p-3 rounded-lg">
            <Wrench className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tools of the Trade</h2>
            <p className="text-md text-muted-foreground">The hardware, software, and services I use to build things.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolCategories.map((toolCategory) => (
              <Card key={toolCategory.category} className="flex flex-col overflow-hidden">
                <div className="h-48 overflow-hidden">
                    <img src={toolCategory.image} alt={toolCategory.category} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{toolCategory.category}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {toolCategory.items.map((item) => (
                      <li key={item.name}>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
