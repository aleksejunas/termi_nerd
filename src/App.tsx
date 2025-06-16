
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogLayout from "./components/BlogLayout";
import BlogIndexPage from "./pages/BlogIndexPage";
import PostPage from "./pages/PostPage";
import { ThemeProvider } from "./components/theme-provider";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ContactPage from "./pages/ContactPage";

import AuthPage from "./pages/AuthPage";
import AdminRouteGuard from "./components/AdminRouteGuard";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminNewPostPage from "./pages/admin/AdminNewPostPage";
import AdminEditPostPage from "./pages/admin/AdminEditPostPage";
import GuestbookPage from "./pages/GuestbookPage";
import TagPage from "./pages/TagPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthPage />} />
            <Route element={<BlogLayout />}>
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/:slug" element={<PostPage />} />
              <Route path="/blog/tags/:slug" element={<TagPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/guestbook" element={<GuestbookPage />} />
              
              <Route path="/admin" element={<AdminRouteGuard />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="posts/new" element={<AdminNewPostPage />} />
                <Route path="posts/edit/:slug" element={<AdminEditPostPage />} />
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
