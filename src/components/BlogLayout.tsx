
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const BlogLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default BlogLayout;
