# TermiNerd: A Modern Blog Platform

TermiNerd is a feature-rich, terminal-themed blog platform built with a modern tech stack. It provides a sleek and responsive user interface for readers, along with a comprehensive admin dashboard for content creators.

## Features

-   **Terminal Interface**: A unique, interactive terminal interface for navigating the blog and executing commands.
-   **Full-fledged Blog**: Create, edit, and manage blog posts with a Markdown editor.
-   **Admin Dashboard**: A secure area for administrators to manage posts, users, and view site statistics.
-   **Image Management**: Seamless image uploads to Supabase Storage, both for post covers and embedded content.
-   **Authentication**: Secure user authentication and role-based access control.
-   **Responsive Design**: A clean, modern UI built with Tailwind CSS and shadcn/ui, with dark mode support.
-   **Search and Filtering**: Easily find posts with built-in search and tag-based filtering.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **UI**: shadcn/ui, Tailwind CSS
-   **Backend & Database**: Supabase
-   **Routing**: React Router
-   **State Management**: React Query
-   **Forms**: React Hook Form with Zod for validation

## Getting Started

### Prerequisites

-   Node.js and pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/aleksejunas/termi_nerd.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd termi_nerd
    ```

3.  **Install dependencies:**
    ```sh
    pnpm install
    ```

4.  **Set up environment variables:**
    Create a `.env.development` file in the root of the project and add your Supabase URL and anon key. You can get these from your Supabase project dashboard.
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

5.  **Run the development server:**
    ```sh
    pnpm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Deployment

You can deploy this project to any static hosting service like Vercel, Netlify, or GitHub Pages.

1.  **Build the project:**
    ```sh
    pnpm run build
    ```
2.  Deploy the `dist` folder to your hosting provider.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.