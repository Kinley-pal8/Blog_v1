# KP's Blog

A modern, full-stack blog application built with **Next.js**, **Clerk Authentication**, and **Supabase**. This project combines a beautiful frontend with a robust backend, allowing for seamless blog management and user interactions.

## Features

### Blog System

- **Create, Read, Update, Delete (CRUD)** blog posts
- **Publish/Unpublish** posts with draft support
- **Rich content** support with markdown and HTML
- **Blog listing** with pagination and filtering
- **Individual post pages** with comments and engagement metrics

### User Management

- **Clerk Authentication** - Secure user sign-up and sign-in
- **User profiles** with customizable information
- **Admin dashboard** for content management
- **Role-based access control** (Admin/User roles)

### Design & UX

- **Dark/Light theme** support with smooth transitions
- **Responsive design** - Mobile, tablet, and desktop optimized
- **Scroll reveal animations** for engaging page interactions
- **Modern UI components** with Tailwind CSS
- **Performance optimized** with Next.js image optimization

### Security & Backend

- **Secure authentication** with Clerk
- **Supabase databases** for reliable data storage
- **API endpoints** for blog and user operations
- **Environment variable** management for sensitive data
- **SQL migrations** for database setup

## Tech Stack

### Frontend

- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with server-side rendering
- **[React 19.2.3](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 3.4.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Clerk 6.39.0](https://clerk.com/)** - Authentication & user management

### Backend

- **[Supabase](https://supabase.com/)** - PostgreSQL database with real-time features
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[PostCSS](https://postcss.org/)** - CSS transformation tool

### Development Tools

- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- **[ESLint](https://eslint.org/)** - Code quality and standards
- **[Git](https://git-scm.com/)** - Version control

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Clerk account** (for authentication)
- **Supabase account** (for database)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kps-blog.git
cd kps-blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory using `.env.example` as a template:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```dotenv
# Clerk Keys (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase Keys (get from https://app.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Settings
ADMIN_USER_ID=your_clerk_user_id_optional
```

### 4. Database Setup

Run the SQL migrations to set up your Supabase database:

```bash
# Execute the following SQL files in your Supabase dashboard:
# scripts/database/supabase-setup.sql
# scripts/database/supabase-users-table.sql
# scripts/database/supabase-auth-migration.sql
```

Alternatively, you can use the Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents from each file in `scripts/database/`
4. Execute each script

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your application.

## Project Structure

```
blog/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── admin/        # Admin endpoints
│   │   │   ├── posts/        # Post management endpoints
│   │   │   ├── upload/       # File upload endpoint
│   │   │   └── users/        # User management endpoints
│   │   ├── blog/             # Blog pages
│   │   ├── dashboard/        # Admin dashboard
│   │   ├── sign-in/          # Authentication pages
│   │   ├── sign-up/
│   │   ├── users/            # User pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable React components
│   │   ├── BlogCard.tsx
│   │   ├── CreatePostForm.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts          # Clerk authentication utilities
│   │   ├── supabase.ts      # Supabase client setup
│   │   └── ...
│   └── middleware.ts         # Next.js middleware
├── public/                    # Static assets (images, icons)
├── scripts/
│   ├── database/            # SQL migrations
│   │   ├── supabase-setup.sql
│   │   ├── supabase-users-table.sql
│   │   └── supabase-auth-migration.sql
│   └── update-post.js       # Utility scripts
├── docs/
│   └── examples/            # Documentation and examples
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## API Endpoints

### Posts

- `GET /api/posts` - Get all published posts
- `GET /api/posts/[id]` - Get a specific post
- `POST /api/posts` - Create a new post (Admin)
- `PUT /api/posts/[id]` - Update a post (Admin)
- `DELETE /api/posts/[id]` - Delete a post (Admin)

### Users

- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get a specific user
- `POST /api/users` - Create/register a user

### Admin

- `GET /api/admin` - Admin dashboard data

### Upload

- `POST /api/upload` - Upload images/files

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Other Platforms

This application can be deployed to any platform that supports Node.js:

- **Netlify** with functions
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS** (Lambda, Elastic Beanstalk)

Make sure to:

1. Build the project: `npm run build`
2. Set all environment variables on your hosting platform
3. Run the start command: `npm start`

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code with ESLint
npm run lint
```

## Customization

### Change Blog Title

Edit `src/app/page.tsx` to update the hero section with your name and tagline.

### Add Components

Place new React components in `src/components/`

### Modify Styles

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Use Tailwind utility classes inline

### Add Routes

Create new folders in `src/app/` following Next.js App Router conventions.

## Security Notes

**Important:**

- Never commit `.env.local` or any files with secrets
- Use `.env.example` as a template only
- Keep API keys and secrets in environment variables
- Enable Row Level Security (RLS) in Supabase
- Use HTTPS in production
- Validate all user inputs on the backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

**Name:** KP  
**Email:** 02230287.cst@rub.edu.bt  
**Role:** Aspiring Software Engineer / Ethical Hacker

For business inquiries and collaborations, feel free to reach out!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - Amazing React framework
- [Clerk](https://clerk.com/) - Modern authentication
- [Supabase](https://supabase.com/) - Open-source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- All contributors and users of this project

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---
# Updated
