
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="space-y-12">
        <div>
            <Button asChild variant="ghost" className="mb-4 -ml-4">
                <Link to="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    All Projects
                </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{project.description}</p>

            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <Button asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.repoUrl && (
                <Button asChild variant="secondary">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub Repo
                  </a>
                </Button>
              )}
            </div>
        </div>
      
        {project.images && project.images.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Gallery</h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {project.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                          <img src={image} alt={`${project.title} screenshot ${index + 1}`} className="w-full h-full object-cover" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-6">About This Project</h2>
          <div className="prose prose-invert max-w-none">
            <p>{project.longDescription}</p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h3 className="text-2xl font-bold mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4">Challenges & Learnings</h3>
            <div className="prose prose-invert max-w-none text-muted-foreground">
               <p>{project.challenges}</p>
            </div>
          </section>
        </div>
    </article>
  );
};

export default ProjectDetailsPage;
