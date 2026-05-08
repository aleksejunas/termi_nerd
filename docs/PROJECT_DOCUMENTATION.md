# TermiNerd Project Documentation

## Project Overview

TermiNerd is a modern blog platform built with React, TypeScript, and Supabase. It features a clean, responsive design with dark mode support and a comprehensive admin interface for content management.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Storage)
- **State Management**: React Query
- **Routing**: React Router
- **Form Handling**: React Hook Form + Zod
- **Markdown**: ReactMarkdown + remarkGfm

## Project Structure

### Core Directories

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── integrations/  # External service integrations
├── lib/          # Utility functions and shared code
├── hooks/        # Custom React hooks
└── utils/        # Helper functions
```

### Key File Relationships and Code Connections

#### 1. Blog Post Flow

```
AdminEditPostPage.tsx
    ↓ (uses)
PostForm.tsx
    ↓ (uses)
ImageUploader.tsx
    ↓ (uploads to)
Supabase Storage
    ↓ (saves to)
Supabase Database
    ↓ (fetched by)
PostPage.tsx
    ↓ (renders with)
ReactMarkdown
```

Key Code Connections:

```typescript
// AdminEditPostPage.tsx -> PostForm.tsx
const PostForm = ({ post, onSubmit }) => {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: post || {
      title: '',
      content: '',
      // ...
    },
  });
};

// PostForm.tsx -> ImageUploader.tsx
const ImageUploader = ({ onImageUpload }) => {
  const handleUpload = async () => {
    const { data, error } = await supabase.storage
      .from('content-images')
      .upload(filePath, file);
    if (data) {
      onImageUpload(data.publicUrl);
    }
  };
};

// PostPage.tsx -> ReactMarkdown
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    img: ({node, ...props}) => <MarkdownImage {...props} />,
  }}
>
  {post.content}
</ReactMarkdown>
```

#### 2. Authentication Flow

```
AuthPage.tsx
    ↓ (authenticates with)
Supabase Auth
    ↓ (protected by)
AdminRouteGuard.tsx
    ↓ (wraps)
AdminDashboardPage.tsx
```

Key Code Connections:

```typescript
// AuthPage.tsx -> Supabase Auth
const handleLogin = async (credentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
};

// AdminRouteGuard.tsx -> Admin Pages
const AdminRouteGuard = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" />;
  return children;
};
```

#### 3. Data Management Flow

```
useQuery (React Query)
    ↓ (fetches from)
Supabase Client
    ↓ (updates)
Database
    ↓ (triggers)
useQuery Invalidation
```

Key Code Connections:

```typescript
// Data fetching with React Query
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: () => supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
});

// Data mutation with React Query
const mutation = useMutation({
  mutationFn: updatePost,
  onSuccess: () => {
    queryClient.invalidateQueries(['posts']);
  },
});
```

#### 4. Image Processing Flow

```
ImageUploader.tsx
    ↓ (uploads to)
Supabase Storage
    ↓ (generates)
Public URL
    ↓ (inserts into)
Content Editor
    ↓ (renders in)
PostPage.tsx
```

Key Code Connections:

```typescript
// ImageUploader.tsx -> Storage
const uploadImage = async (file) => {
  const filePath = `content-images/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('content-images')
    .upload(filePath, file);
  return data?.publicUrl;
};

// Content Editor -> Markdown
const insertImage = (url) => {
  const markdown = `![Image](${url})`;
  // Insert at cursor position
};
```

#### 5. State Management Flow

```
React Query
    ↓ (manages)
Server State
    ↓ (syncs with)
Local State
    ↓ (updates)
UI Components
```

Key Code Connections:

```typescript
// Server state management
const { data, isLoading } = useQuery({
  queryKey: ['post', slug],
  queryFn: () => fetchPost(slug),
});

// Local state management
const [searchQuery, setSearchQuery] = useState('');
const filteredPosts = useMemo(() => 
  posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  ),
  [posts, searchQuery]
);
```

### Key File Dependencies

1. **AdminEditPostPage.tsx**

   - Depends on: `PostForm.tsx`, `ImageUploader.tsx`, `useAuth.ts`
   - Provides: Post editing interface
2. **PostPage.tsx**

   - Depends on: `ReactMarkdown`, `MarkdownImage.tsx`, `useQuery`
   - Provides: Post rendering and display
3. **BlogIndexPage.tsx**

   - Depends on: `useQuery`, `PostCard.tsx`
   - Provides: Post listing and search
4. **ImageUploader.tsx**

   - Depends on: `supabase.ts`, `useToast.ts`
   - Provides: Image upload functionality
5. **AdminRouteGuard.tsx**

   - Depends on: `useAuth.ts`, `AuthPage.tsx`
   - Provides: Route protection

### Key Components

#### 1. Blog System

- **PostPage.tsx**: Renders individual blog posts

  - Handles markdown rendering
  - Displays images and content
  - Shows tags and metadata
  - Includes social sharing
  - Admin edit button for authorized users
- **BlogIndexPage.tsx**: Main blog listing

  - Displays post previews
  - Search functionality
  - Tag filtering
  - Responsive grid layout

#### 2. Admin System

- **AdminDashboardPage.tsx**: Admin control panel

  - Post management
  - User management
  - Statistics
- **AdminEditPostPage.tsx**: Post editor

  - Rich text editing
  - Image upload
  - Tag management
  - Publishing controls

#### 3. Image Handling

- **ImageUploader.tsx**: Handles image uploads
  - Supabase storage integration
  - Markdown link generation
  - Preview functionality
  - Direct content insertion

#### 4. Authentication

- **AuthPage.tsx**: Login/Register interface
- **AdminRouteGuard.tsx**: Protects admin routes
- Supabase authentication integration

## Key Features

### 1. Blog Post Management

```typescript
// Post structure in Supabase
type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};
```

### 2. Image Handling

- Images are stored in Supabase Storage
- Two types of images:
  1. Cover images (stored in `post-images/`)
  2. Content images (stored in `content-images/`)
- Markdown integration for content images
- Automatic URL generation and linking

### 3. Markdown Processing

```typescript
// Example of markdown rendering in PostPage
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({node, ...props}) => <h1 className="text-4xl font-bold" {...props} />,
    img: ({node, ...props}) => <MarkdownImage {...props} />,
    // ... other component customizations
  }}
>
  {post.content}
</ReactMarkdown>
```

### 4. Admin Features

- Role-based access control
- Post creation and editing
- Image management
- Tag management
- Publishing controls

## Data Flow

### 1. Blog Post Creation

1. Admin creates post in `AdminEditPostPage`
2. Form data validated with Zod
3. Images uploaded to Supabase Storage
4. Post saved to Supabase database
5. Redirect to post view

### 2. Image Upload Process

1. User selects image in `ImageUploader`
2. Image uploaded to Supabase Storage
3. Public URL generated
4. Markdown link created
5. Link inserted into content at cursor position

### 3. Post Viewing

1. User visits post URL
2. `PostPage` fetches post data
3. Markdown content rendered
4. Images loaded from Supabase Storage
5. Tags and metadata displayed

## Security

### 1. Authentication

- Supabase authentication
- JWT token management
- Protected routes

### 2. Authorization

- Role-based access control
- Admin-only routes
- Content protection

### 3. Data Validation

- Zod schema validation
- Input sanitization
- Type safety with TypeScript

## Styling System

### 1. Theme

- Dark mode support
- Custom color scheme
- Responsive design

### 2. Components

- shadcn/ui component library
- Custom styled components
- Tailwind CSS utilities

## Best Practices

### 1. Code Organization

- Component-based architecture
- Separation of concerns
- Reusable components
- Type safety

### 2. Performance

- Lazy loading
- Image optimization
- Caching with React Query
- Efficient routing

### 3. User Experience

- Responsive design
- Loading states
- Error handling
- Intuitive navigation

## Common Patterns

### 1. Data Fetching

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});
```

### 2. Form Handling

```typescript
const form = useForm<PostFormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    title: '',
    content: '',
    // ...
  },
});
```

### 3. Image Upload

```typescript
const handleUpload = async () => {
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file);
  // ...
};
```

## Future Improvements

### 1. Planned Features

- Comment system
- User profiles
- Advanced search
- Analytics

### 2. Technical Improvements

- Performance optimization
- SEO enhancements
- Testing coverage
- Documentation updates

## Getting Started

### 1. Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Configure Supabase
4. Set environment variables
5. Run development server: `npm run dev`

### 2. Development

- Use TypeScript
- Follow component structure
- Maintain type safety
- Update documentation

### 3. Deployment

- Build: `npm run build`
- Deploy to hosting service
- Configure Supabase
- Set up environment variables

## Conclusion

TermiNerd is a modern, feature-rich blog platform built with best practices in mind. It provides a solid foundation for content management while maintaining good performance and user experience. The modular architecture allows for easy extension and maintenance.

## Additional Resources

- [React Documentation](https://reactjs.org/)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
