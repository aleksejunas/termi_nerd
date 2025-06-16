
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { projects } from '@/data/projects';
import { Link } from 'react-router-dom';

const ProjectsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {projects.map((project) => (
          <Link to={`/projects/${project.slug}`} key={project.slug} className="block">
            <Card className="hover:border-primary transition-colors h-full">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
       <p className="mt-8 text-muted-foreground">Click on a project to see more details!</p>
    </div>
  );
};

export default ProjectsPage;
