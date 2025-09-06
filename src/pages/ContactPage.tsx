import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

const ContactPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-muted-foreground" />
              <a
                href="mailto:dev@aleksejunas.no"
                className="text-primary underline hover:no-underline"
              >
                your.email@example.com
              </a>
            </li>
            <li className="flex items-center gap-4">
              <Github className="w-6 h-6 text-muted-foreground" />
              <a
                href="https://github.com/aleksejunas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                github.com/aleksejunas
              </a>
            </li>
            <li className="flex items-center gap-4">
              <Linkedin className="w-6 h-6 text-muted-foreground" />
              <a
                href="https://linkedin.com/in/rolfdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                linkedin.com/in/yourprofile
              </a>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Replace these with your actual links!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
