# Job Portal - Next.js Application

This is a comprehensive job portal application built with [Next.js](https://nextjs.org) and TypeScript, featuring role-based authentication and modern UI components.

## 🚀 Features

### Authentication System
- **JWT-based Authentication** with access tokens and refresh tokens
- **Role-based Access Control** (Job Seeker & Job Provider)
- **OTP Verification** for email confirmation
- **Secure Session Management** using Zustand with persistence
- **Protected Routes** with middleware and auth guards

### User Roles
- **Job Seekers**: Profile management, phone verification, dashboard access
- **Job Providers**: Separate dashboard and management interface

### Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom components with Lucide React icons
- **Authentication**: Custom JWT implementation
- **Deployment**: Vercel with GitHub Actions CI/CD

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Login page
│   │   │   ├── signup/        # Registration page
│   │   │   └── verify-otp/    # OTP verification
│   │   └── dashboard/         # Protected dashboard routes
│   │       ├── job-seeker/    # Job seeker dashboard
│   │       └── job-provider/  # Job provider dashboard
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   ├── global/           # Global components (Loader, etc.)
│   │   └── ui/               # UI components (Toast, etc.)
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useAuthInit.ts    # Auth initialization
│   │   └── useEnsureAuth.ts  # Auth guard hook
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Authentication API calls
│   │   ├── axios.ts          # Axios configuration
│   │   └── profile/          # Profile-related APIs
│   ├── store/                # State management
│   │   └── authStore.ts      # Zustand auth store
│   └── types/                # TypeScript type definitions
│       └── auth.ts           # Authentication types
├── .github/workflows/        # GitHub Actions CI/CD
└── next.config.ts           # Next.js configuration
```

## 🔐 Authentication Flow

### 1. Registration Process
- User selects role (Job Seeker/Job Provider)
- Fills registration form with email verification
- Receives OTP via email
- Verifies OTP to activate account

### 2. Login Process
- Email/password authentication
- JWT access token stored in memory
- Refresh token stored in HTTP-only cookies
- Automatic role-based dashboard redirection

### 3. Session Management
- **Zustand Store**: Persists user data locally
- **Token Refresh**: Automatic refresh token handling
- **Auth Guards**: `useEnsureAuth` hook protects routes
- **Axios Interceptors**: Handle token refresh automatically

### 4. Security Features
- HTTP-only cookies for refresh tokens
- Access tokens in memory only
- Automatic logout on token expiry
- Protected API routes with role verification

## 🛠️ Getting Started

### Prerequisites
- Node.js 21.0.0
- pnpm 8.x

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Deployment

### Vercel Deployment
The application is configured for automatic deployment to Vercel:

- **CI/CD Pipeline**: GitHub Actions workflow
- **Environment Variables**: Configure in Vercel dashboard
- **Production URL**: Automatically generated on deployment

### Environment Variables
```bash
NEXT_PUBLIC_BACKEND_URL=your_backend_url
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 📱 Key Components

### Authentication Pages
- **Sign In**: `/auth/signin` - User login with role-based redirection
- **Sign Up**: `/auth/signup` - Registration with role selection
- **OTP Verification**: `/auth/verify-otp` - Email verification

### Dashboard Routes
- **Job Seeker**: `/dashboard/job-seeker` - Job seeker interface
- **Job Provider**: `/dashboard/job-provider` - Job provider interface
- **Profile Management**: Phone verification and profile updates

### Custom Hooks
- `useAuth()`: Fetch and manage user authentication state
- `useAuthInit()`: Initialize authentication on app load
- `useEnsureAuth()`: Protect routes and ensure authentication

## 🔧 API Integration

### Authentication Endpoints
- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `POST /user/verify` - OTP verification
- `POST /auth/refresh-token` - Token refresh
- `GET /auth/check-auth` - Verify authentication

### Error Handling
- Axios error interceptors
- Toast notifications for user feedback
- Automatic token refresh on 401 errors
