# Developer Onboarding Guide

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [QUICK_START.md](file://QUICK_START.md)
- [package.json](file://package.json)
- [vite.config.ts](file://vite.config.ts)
- [tailwind.config.ts](file://tailwind.config.ts)
- [eslint.config.js](file://eslint.config.js)
- [tsconfig.json](file://tsconfig.json)
- [BACKEND_CONFIGURATION_AUDIT.md](file://BACKEND_CONFIGURATION_AUDIT.md)
- [SECURITY.md](file://SECURITY.md)
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts)
- [supabase/config.toml](file://supabase/config.toml)
- [scripts/setup-database.js](file://scripts/setup-database.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure and Codebase Conventions](#project-structure-and-codebase-conventions)
4. [Development Tools and Workflow](#development-tools-and-workflow)
5. [Backend Configuration](#backend-configuration)
6. [Security Considerations](#security-considerations)
7. [Testing and Quality Assurance](#testing-and-quality-assurance)
8. [Making Changes and Submitting Pull Requests](#making-changes-and-submitting-pull-requests)
9. [Troubleshooting Common Issues](#troubleshooting-common-issues)
10. [Additional Resources](#additional-resources)

## Introduction

Welcome to the Sleek Apparels development team! This onboarding guide is designed to help new developers quickly get up to speed with the codebase, development environment, and team processes. The Sleek Apparels platform is a comprehensive knitwear manufacturing and supply chain management system featuring AI-powered production tracking (LoopTrace™ Technology) and intelligent quote generation.

The application is built with modern web technologies including React 18, TypeScript, Vite, and Supabase as the backend-as-a-service platform. The codebase follows industry best practices for performance, security, and maintainability.

This guide will walk you through setting up your development environment, understanding the project structure, configuring backend services, following security protocols, and contributing to the codebase effectively.

**Section sources**
- [README.md](file://README.md#L1-L362)

## Development Environment Setup

### Prerequisites

Before you begin, ensure you have the following tools installed on your development machine:

- **Node.js 18+** (LTS version recommended)
- **npm** (included with Node.js)
- **Git** for version control
- **Supabase CLI** (optional, for local database management)
- **Vite** (installed as a dev dependency)

### Step-by-Step Setup

Follow these steps to set up your development environment:

```bash
# 1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd sleekapp-v100-3

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file in the project root with the following content:
VITE_SUPABASE_URL=https://eqpftggctumujhutomom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Starting the Development Server

Once dependencies are installed and environment variables are configured, start the development server:

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`. The Vite development server provides hot module replacement (HMR) for fast development feedback.

### Environment Configuration

The application uses Vite's environment variable system. All environment variables must be prefixed with `VITE_` to be exposed to the client-side code. The following environment variables are required:

- `VITE_SUPABASE_URL`: The Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: The Supabase anonymous key for client-side access

These variables are validated at runtime by the `env-validator.ts` module to ensure they are properly configured before the application starts.

**Section sources**
- [README.md](file://README.md#L84-L113)
- [QUICK_START.md](file://QUICK_START.md#L3-L11)
- [vite.config.ts](file://vite.config.ts#L81-L82)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L6-L9)

## Project Structure and Codebase Conventions

### Directory Structure

The project follows a feature-based organization with the following key directories:

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and helpers
├── integrations/   # Third-party service integrations
├── contexts/       # React context providers
├── types/          # TypeScript type definitions
└── assets/         # Static assets (images, fonts, etc.)
```

### Component Organization

Components are organized by feature area within the `src/components` directory:

- `admin/` - Admin-specific components
- `auth/` - Authentication components
- `buyer/` - Buyer-facing components
- `production/` - Production tracking components
- `quote/` - Quote generation components
- `supplier/` - Supplier-facing components
- `ui/` - Base UI components from shadcn/ui

Each component is implemented as a TypeScript React component with proper type definitions and follows the naming convention `ComponentName.tsx`.

### Code Conventions

The codebase follows these conventions:

- **TypeScript**: All code is written in TypeScript with strict type checking
- **ESLint**: Code quality is enforced with ESLint using the `eslint.config.js` configuration
- **Prettier**: Code formatting is standardized with Prettier
- **React Hooks**: Custom hooks are stored in `src/hooks/` and follow the `use*` naming convention
- **State Management**: React Query is used for data fetching and state management
- **Styling**: Tailwind CSS is used for styling with a custom configuration in `tailwind.config.ts`

### Routing Structure

The application uses React Router for client-side routing. The routing configuration is defined in `src/App.tsx` and includes:

- Public routes accessible to all users
- Protected routes requiring authentication
- Role-based routes with different access levels for buyers, suppliers, and admins

Route protection is implemented using the `ProtectedRoute` and `RoleBasedRoute` components that wrap protected routes and handle access control.

**Section sources**
- [README.md](file://README.md#L145-L217)
- [QUICK_START.md](file://QUICK_START.md#L122-L130)
- [src/App.tsx](file://src/App.tsx#L3-L362)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L196)
- [eslint.config.js](file://eslint.config.js#L1-L44)

## Development Tools and Workflow

### Available Scripts

The project includes several npm scripts for development tasks:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests without cache
npx vitest run --no-cache

# Check TypeScript types
npx tsc --noEmit

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Development Server Configuration

The Vite development server is configured in `vite.config.ts` with the following settings:

- Port: 8080
- Host: `::` (IPv6 and IPv4)
- HMR client port: 8081
- Base path: `/`

The server is configured to work with the Lovable AI development platform, which provides additional development features.

### Build Configuration

The production build is optimized for performance with the following features:

- **Code Splitting**: The build configuration uses manual chunking to optimize loading performance
- **Compression**: Both gzip and Brotli compression are enabled
- **Minification**: JavaScript is minified with esbuild and CSS with lightningcss
- **Source Maps**: Hidden source maps are generated for debugging
- **Bundle Analysis**: A bundle analyzer is available in production builds

The build process is configured to create optimized chunks for critical dependencies like React, React Router, Supabase, and other major libraries to improve initial loading performance.

### Performance Optimizations

The application includes several performance optimizations:

- **Lazy Loading**: Non-critical pages are lazy-loaded using React's `lazy` function
- **Code Splitting**: The build configuration splits code into logical chunks
- **Preload Critical CSS**: Critical CSS is preloaded to avoid render-blocking
- **DNS Prefetch**: DNS prefetch is configured for the Supabase backend
- **Route Prefetching**: Intelligent route prefetching is implemented
- **Image Optimization**: Image optimization is available (currently disabled due to build issues)

These optimizations are implemented in `src/main.tsx`, `vite.config.ts`, and various utility files in `src/lib/`.

**Section sources**
- [QUICK_START.md](file://QUICK_START.md#L3-L29)
- [package.json](file://package.json#L6-L12)
- [vite.config.ts](file://vite.config.ts#L1-L216)
- [src/main.tsx](file://src/main.tsx#L1-L39)

## Backend Configuration

### Supabase Integration

The application uses Supabase as its backend-as-a-service platform, providing:

- PostgreSQL database
- Real-time subscriptions
- Authentication and authorization
- Storage for files and images
- Edge Functions for serverless operations

The Supabase client is configured in `src/integrations/supabase/client.ts` and uses environment variables for configuration. The client is typed using the generated types from the Supabase schema.

### Environment Variables

The backend configuration is managed through environment variables with fallback values in the build configuration. The key environment variables are:

- `VITE_SUPABASE_URL`: The Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: The Supabase publishable key

These variables are validated at runtime by the `env-validator.ts` module to ensure they are properly configured before the application starts.

### Configuration Files

The backend configuration is verified in the `BACKEND_CONFIGURATION_AUDIT.md` file, which confirms that all configuration files are correctly pointing to the production Supabase project:

- `vite.config.ts`: Contains fallback values for Supabase URL and keys
- `supabase/config.toml`: Contains the project ID
- `src/integrations/supabase/client.ts`: Uses the environment validator to access configuration
- `src/lib/env-validator.ts`: Validates environment variables at runtime
- `src/lib/performanceOptimizer.ts`: Contains DNS prefetch and preconnect URLs

The audit confirms that all configuration files are consistent and correctly configured for the production environment.

### Database Migrations

Database schema changes are managed through Supabase migrations in the `supabase/migrations/` directory. Each migration is a SQL file that modifies the database schema. Migrations are applied in order and should be tested thoroughly before deployment.

### Edge Functions

The application uses Supabase Edge Functions for serverless operations. These functions are located in `supabase/functions/` and include:

- Authentication functions
- Email services
- AI-powered features
- Data processing
- Webhooks
- Analytics services

Each function is implemented as a TypeScript file with a handler function that responds to HTTP requests.

**Section sources**
- [BACKEND_CONFIGURATION_AUDIT.md](file://BACKEND_CONFIGURATION_AUDIT.md#L1-L176)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L20)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L1-L143)
- [vite.config.ts](file://vite.config.ts#L81-L82)
- [supabase/config.toml](file://supabase/config.toml#L1)

## Security Considerations

### Security Policy

The project maintains a security policy documented in `SECURITY.md` that outlines the supported versions and vulnerability reporting process. The current version (1.1.0) is supported with security updates.

### Authentication and Authorization

The application implements a role-based access control system with the following user roles:

- **Buyer**: Customers placing orders
- **Supplier**: Manufacturing partners
- **Admin**: Platform administrators
- **Staff**: Operations team

Authentication is handled by Supabase with secure JWT tokens. The application uses Supabase's Row Level Security (RLS) to ensure that users can only access data they are authorized to see.

### Environment Security

The application follows security best practices for environment configuration:

- **Environment Variables**: Sensitive configuration is stored in environment variables
- **Fallback Values**: The build configuration includes fallback values that match production settings
- **Runtime Validation**: Environment variables are validated at runtime to prevent misconfiguration
- **Public Keys**: The Supabase publishable key is safe to be public as it's designed for client-side use with RLS

### Code Security

The codebase includes several security features:

- **Input Validation**: Form inputs are validated using Zod schemas
- **XSS Protection**: DOMPurify is used to sanitize user content
- **CORS**: Proper CORS headers are configured
- **Content Security Policy**: Implemented through Helmet
- **Rate Limiting**: Implemented for critical endpoints

### Vulnerability Reporting

Security vulnerabilities should be reported through the proper channels as outlined in the security policy. The team follows a responsible disclosure process and responds promptly to reported vulnerabilities.

**Section sources**
- [SECURITY.md](file://SECURITY.md#L1-L22)
- [README.md](file://README.md#L179-L190)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L1-L143)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L20)

## Testing and Quality Assurance

### Testing Framework

The application uses Vitest as the testing framework with the following configuration:

- **Test Runner**: Vitest
- **Assertions**: @testing-library/jest-dom
- **Component Testing**: @testing-library/react
- **User Interactions**: @testing-library/user-event

Test files are colocated with the code they test, typically in `__tests__` directories or with a `.test.ts` extension.

### Running Tests

Tests can be run using the following commands:

```bash
# Run all tests
npm run test

# Run tests without cache
npx vitest run --no-cache

# Run specific test file
npx vitest run src/hooks/__tests__/useAdminAuth.test.ts

# Check TypeScript types
npx tsc --noEmit
```

### Test Structure

Tests follow the Arrange-Act-Assert pattern and use the Testing Library best practices:

- **Render Components**: Use `render` from `@testing-library/react`
- **Query Elements**: Use semantic queries like `getByRole`, `getByText`
- **User Interactions**: Use `userEvent` for realistic user interactions
- **Assertions**: Use `expect` with Jest DOM matchers

### Code Quality

The project enforces code quality through:

- **ESLint**: Code quality rules are defined in `eslint.config.js`
- **TypeScript**: Strict type checking prevents many common errors
- **Prettier**: Consistent code formatting
- **Bundle Analysis**: The build includes a bundle analyzer to monitor bundle size

The ESLint configuration extends the recommended rules for JavaScript and TypeScript and includes plugins for React hooks and refresh.

**Section sources**
- [QUICK_START.md](file://QUICK_START.md#L19-L29)
- [package.json](file://package.json#L12)
- [src/hooks/__tests__/useAdminAuth.test.ts](file://src/hooks/__tests__/useAdminAuth.test.ts)
- [eslint.config.js](file://eslint.config.js#L1-L44)

## Making Changes and Submitting Pull Requests

### Development Workflow

Follow this workflow when making changes to the codebase:

1. **Create a Feature Branch**: Create a new branch from `main` with a descriptive name
   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **Make Changes**: Implement your changes following the code conventions

3. **Test Locally**: Run the application and tests to ensure your changes work correctly
   ```bash
   npm run dev
   npm run test
   ```

4. **Commit Changes**: Commit your changes with a descriptive message
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

5. **Push to Remote**: Push your branch to the remote repository
   ```bash
   git push origin feature/descriptive-name
   ```

6. **Create Pull Request**: Create a pull request through the GitHub interface

### Code Standards

When making changes, follow these code standards:

- **Type Safety**: Use TypeScript types for all variables, function parameters, and return values
- **Component Structure**: Follow the existing component patterns and organization
- **Naming Conventions**: Use clear, descriptive names for variables, functions, and components
- **Documentation**: Add JSDoc comments for complex functions and components
- **Performance**: Consider performance implications of your changes
- **Accessibility**: Ensure UI changes are accessible

### Pull Request Requirements

Pull requests should include:

- **Descriptive Title**: Clear summary of the changes
- **Detailed Description**: Explanation of what was changed and why
- **Issue Reference**: Link to the related issue if applicable
- **Screenshots**: For UI changes, include before/after screenshots
- **Testing Instructions**: How to test the changes

The team uses automated checks for code quality, tests, and build status. All checks must pass before a pull request can be merged.

### Review Process

Pull requests are reviewed by at least one other team member. The review process focuses on:

- **Code Quality**: Adherence to coding standards and best practices
- **Functionality**: Correct implementation of requirements
- **Performance**: Impact on application performance
- **Security**: Potential security implications
- **Tests**: Adequate test coverage for changes

After approval, the pull request can be merged into the `main` branch.

**Section sources**
- [README.md](file://README.md#L318-L331)
- [QUICK_START.md](file://QUICK_START.md#L133-L146)

## Troubleshooting Common Issues

### Build Fails

If the build fails, try the following steps:

```bash
# Clear Vite cache and rebuild
rm -rf node_modules/.vite
npm run build

# If still failing, clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

### Development Server Issues

If the development server fails to start:

1. Check that Node.js 18+ is installed
2. Verify that all dependencies are installed (`npm install`)
3. Ensure environment variables are properly configured
4. Check for port conflicts (default port is 8080)

### TypeScript Errors

For TypeScript errors, run:

```bash
# Check for type errors
npx tsc --noEmit

# If types are missing, ensure types are installed
npm install @types/package-name
```

### Supabase Connection Issues

If you encounter Supabase connection issues:

1. Verify that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set
2. Check that the Supabase project is active and accessible
3. Verify that the environment variables are properly loaded
4. Check the browser console for network errors

### Test Failures

For test failures:

```bash
# Run tests without cache
npx vitest run --no-cache

# Run specific test file to isolate the issue
npx vitest run path/to/test-file.test.ts
```

### Known Issues

The following known issues may affect development:

- **Image Optimizer Plugin**: Currently disabled due to build issues
- **Auth Tests**: `Auth.test.tsx` needs mocking fix
- **Occasional Build Failures**: Re-running the build typically resolves the issue
- **Photo Upload**: Requires Supabase storage configuration
- **Real-time Notifications**: Need additional setup in Supabase

These issues are documented in `README.md` and `QUICK_START.md` and are being addressed in future updates.

**Section sources**
- [QUICK_START.md](file://QUICK_START.md#L96-L118)
- [README.md](file://README.md#L303-L312)
- [QUICK_START.md](file://QUICK_START.md#L174-L177)

## Additional Resources

### Documentation

The following documentation files are available in the repository:

- `README.md`: Project overview, features, and setup instructions
- `QUICK_START.md`: Quick reference for running the project and common tasks
- `BACKEND_CONFIGURATION_AUDIT.md`: Detailed audit of backend configuration
- `SECURITY.md`: Security policy and vulnerability reporting
- `IMPLEMENTATION_SUMMARY_2025-11-27.md`: Detailed implementation summary
- `AI_VISUAL_ENHANCEMENT_IMPLEMENTATION.md`: Guide for AI visual enhancements

### Support and Contact

For questions or issues, contact:

- **Project Lead**: Khondaker Rajiur Rahman
- **Company**: Sleek Apparels Limited
- **Lovable Support**: Available through the Lovable dashboard

### Development Tools

The following tools are used in the development process:

- **Lovable**: AI-powered development platform
- **Supabase**: Backend infrastructure
- **shadcn/ui**: UI components
- **Tailwind CSS**: Styling framework
- **Vite**: Build tool
- **React**: UI framework
- **TypeScript**: Type safety

### Future Enhancements

The roadmap includes several planned features:

- **Enhanced AI Quote Generator**: Real-time web research for market pricing
- **Advanced Production Features**: IoT sensor integration and barcode scanning
- **Analytics & Reporting**: Predictive analytics and supplier performance scoring
- **Mobile App**: React Native application with push notifications

These features are documented in the `README.md` file under "Future Enhancements."

**Section sources**
- [README.md](file://README.md#L334-L356)
- [QUICK_START.md](file://QUICK_START.md#L156-L161)
- [README.md](file://README.md#L273-L300)