# Developer Onboarding Guide

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [vite.config.ts](file://vite.config.ts)
- [eslint.config.js](file://eslint.config.js)
- [tailwind.config.ts](file://tailwind.config.ts)
- [tsconfig.json](file://tsconfig.json)
- [vitest.config.ts](file://vitest.config.ts)
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts)
- [src/hooks/useAdminAuth.ts](file://src/hooks/useAdminAuth.ts)
- [src/test/setup.ts](file://src/test/setup.ts)
</cite>

## Table of Contents
1. [Getting Started](#getting-started)
2. [Code Standards and Conventions](#code-standards-and-conventions)
3. [Contribution Guidelines](#contribution-guidelines)
4. [Testing Philosophy](#testing-philosophy)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Codebase Navigation](#codebase-navigation)

## Getting Started

This section provides step-by-step instructions for setting up the sleekapp-v100 development environment.

### Cloning the Repository
To begin development, clone the repository using Git:

```bash
git clone <repository-url>
cd sleekapp-v100
```

### Installing Dependencies
The project uses npm for package management. Install all dependencies with:

```bash
npm install
```

This will install all dependencies listed in package.json, including React, TypeScript, Vite, Supabase, and other libraries specified in the project configuration.

### Setting Up Environment Variables
The application requires environment variables for Supabase integration. Create a `.env.local` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

These variables are validated at runtime by the environment validator in `src/lib/env-validator.ts`, which ensures required variables are present and properly formatted.

### Running the Application Locally
Start the development server using Vite:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. The Vite configuration in `vite.config.ts` includes development server settings, plugins for image optimization, compression, and component tagging, as well as build optimizations for production.

**Section sources**
- [README.md](file://README.md#L84-L113)
- [package.json](file://package.json#L7-L11)
- [vite.config.ts](file://vite.config.ts#L11-L27)

## Code Standards and Conventions

This section documents the TypeScript patterns, React component structure, file naming, and code formatting standards used in the project.

### TypeScript Patterns
The project uses TypeScript for type safety with the following configuration:
- Type checking is configured in `tsconfig.json` and referenced configuration files
- The project uses module resolution with path aliases (e.g., `@/` maps to `src/`)
- Strict null checks are disabled to balance type safety with development velocity
- Skip library checks are enabled for faster compilation

### React Component Structure
Components follow a consistent structure and organization:
- Components are organized by feature in the `src/components` directory
- Each component is implemented as a TypeScript React functional component
- Components use React hooks for state management and side effects
- The project uses React 18 with concurrent features
- Components are designed to be reusable and composable

The application architecture uses several key patterns:
- **Provider Pattern**: Context providers (e.g., `WishlistProvider`, `AnalyticsProvider`) wrap the application to provide global state
- **Error Boundaries**: `RootErrorBoundary` and `RouteErrorBoundary` components handle errors gracefully
- **Lazy Loading**: Routes and non-critical components are lazy-loaded to optimize bundle size
- **Suspense**: Used with lazy loading to provide fallback UI during loading

### File Naming and Organization
The project follows a consistent file naming and organization strategy:
- **Directory Structure**: Organized by feature (components, hooks, pages, lib, etc.)
- **Component Files**: Use PascalCase with `.tsx` extension (e.g., `AIQuoteGenerator.tsx`)
- **Hook Files**: Prefixed with `use` and use camelCase (e.g., `useAdminAuth.ts`)
- **Page Files**: Use PascalCase and are located in `src/pages` (e.g., `QuoteGenerator.tsx`)
- **Test Files**: Co-located with source files in `__tests__` directories or with `.test.ts` extension

### Code Formatting with ESLint and Prettier
The project uses ESLint and Prettier for code quality and formatting:

**ESLint Configuration**
The ESLint configuration in `eslint.config.js` includes:
- TypeScript ESLint plugin for TypeScript-specific rules
- React Hooks plugin to enforce rules of hooks
- React Refresh plugin for fast refresh in development
- Recommended rules from JavaScript and TypeScript ESLint configurations
- Custom rules including:
  - `@typescript-eslint/no-unused-vars`: Warn on unused variables
  - `react-hooks/exhaustive-deps`: Warn on missing dependencies in useEffect
  - `react-refresh/only-export-components`: Warn on non-component exports

**Prettier Integration**
While the Prettier configuration is not explicitly shown, it is implied by the project's code standards. The project likely uses Prettier with standard settings for consistent code formatting.

**Section sources**
- [tsconfig.json](file://tsconfig.json#L1-L16)
- [eslint.config.js](file://eslint.config.js#L1-L28)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L196)
- [src/App.tsx](file://src/App.tsx#L1-L345)
- [src/main.tsx](file://src/main.tsx#L1-L39)

## Contribution Guidelines

This section covers the branching strategy, pull request process, code review expectations, and commit message conventions.

### Branching Strategy
The project uses a standard Git branching model:
- `main` branch represents the production-ready code
- Feature branches are created from `main` for new development
- Branch names should be descriptive and follow the format `feature/descriptive-name` or `fix/descriptive-name`
- Regular commits with descriptive messages should be made during development

### Pull Request Process
The pull request process is designed to ensure code quality:
1. Create a feature branch from `main`
2. Implement changes and test locally
3. Commit changes with descriptive messages
4. Push the branch to the remote repository
5. Create a pull request to merge into `main`
6. Address any feedback from code review
7. Merge after approval

### Code Review Expectations
Code reviews focus on several key areas:
- **Code Quality**: Code should be clean, readable, and maintainable
- **Type Safety**: TypeScript types should be used appropriately
- **Performance**: Consider bundle size and runtime performance
- **Accessibility**: Components should be accessible
- **Testing**: New functionality should include appropriate tests
- **Documentation**: Complex logic should be documented

### Commit Message Conventions
Commit messages should be clear and descriptive, following these guidelines:
- Use imperative mood ("Add feature" not "Added feature")
- Start with a verb (e.g., "Add", "Fix", "Update", "Refactor")
- Be specific about what was changed
- For simple changes, a single line is sufficient
- For complex changes, include a body explaining the change

**Section sources**
- [README.md](file://README.md#L319-L325)

## Testing Philosophy

This section outlines the project's testing approach and expectations for test coverage.

### Testing Framework
The project uses Vitest as the testing framework with the following configuration:
- Tests are located in `src/test` and component-specific `__tests__` directories
- The test configuration is defined in `vitest.config.ts`
- Jest DOM and Testing Library are used for DOM testing
- Mocks are provided for browser APIs like IntersectionObserver and ResizeObserver

### Test Setup
The test setup in `src/test/setup.ts` includes:
- Importing `@testing-library/jest-dom` for custom matchers
- Setting up Vitest globals for expect, afterEach, and vi
- Cleaning up after each test with `cleanup()`
- Mocking browser APIs:
  - `window.matchMedia` for responsive design testing
  - `IntersectionObserver` for lazy loading and visibility detection
  - `ResizeObserver` for responsive component testing

### Test Coverage Expectations
The project expects comprehensive test coverage with a focus on:
- **Unit Tests**: Testing individual functions and components in isolation
- **Integration Tests**: Testing how components work together
- **Critical Paths**: Ensuring core user journeys are tested
- **Edge Cases**: Testing error conditions and boundary cases

The coverage configuration in `vitest.config.ts` excludes:
- Node modules
- Test files
- Configuration files
- Type declaration files

Tests should aim for high coverage of business logic while focusing on meaningful tests rather than chasing coverage metrics.

**Section sources**
- [vitest.config.ts](file://vitest.config.ts#L1-L29)
- [src/test/setup.ts](file://src/test/setup.ts#L1-L43)
- [package.json](file://package.json#L47-L50)

## Troubleshooting Guide

This section provides guidance for common development issues.

### Environment Variable Issues
If the application fails to start due to environment variables:
1. Verify that `.env.local` file exists in the project root
2. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
3. Ensure the Supabase URL is a valid URL format
4. Verify the Supabase key is not empty and appears to be a valid JWT

The environment validator in `src/lib/env-validator.ts` will log specific error messages if validation fails.

### Dependency Installation Issues
If npm install fails:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. If using a specific Node.js version, ensure it matches the project requirements (Node.js 18+)

### Development Server Issues
If the Vite development server fails to start:
1. Check for port conflicts (default is 5173)
2. Verify Node.js version is 18+
3. Check that all environment variables are properly set
4. Look for errors in the console output

### Build Issues
If the production build fails:
1. Check for TypeScript compilation errors
2. Verify all environment variables are set
3. Ensure Supabase connection is working
4. Check for any failing tests that might block the build

### Common Runtime Issues
**React Duplication**
The application includes a check in `main.tsx` for React duplication, which can cause issues in development. If you see warnings about React duplication, ensure you have only one instance of React in your node_modules.

**Authentication Issues**
Authentication is handled through Supabase with server-side admin validation. If authentication fails:
1. Verify Supabase configuration
2. Check that the admin-check edge function is deployed
3. Ensure the user has the appropriate role

**Section sources**
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L1-L142)
- [src/main.tsx](file://src/main.tsx#L1-L39)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L20)
- [README.md](file://README.md#L303-L313)

## Codebase Navigation

This section helps developers understand key architectural decisions and navigate the codebase effectively.

### Key Architectural Decisions
The application is built with several key architectural decisions:

**Supabase Integration**
The application uses Supabase as a backend-as-a-service for:
- Authentication and authorization
- PostgreSQL database
- Real-time subscriptions
- Edge Functions (serverless functions)
- Storage

The Supabase client is configured in `src/integrations/supabase/client.ts` with type safety through the Database type from `types.ts`.

**Vite Build Configuration**
The Vite configuration in `vite.config.ts` includes several performance optimizations:
- Code splitting with manual chunks for critical libraries
- CSS code splitting disabled for better caching
- Asset inlining for small assets (< 4KB)
- Image optimization plugin
- Gzip and Brotli compression for production
- Bundle analyzer for production builds

**React Query for Data Management**
React Query is used for data fetching with the following configuration:
- Stale time set to 5 minutes
- Cache time set to 10 minutes
- Refetch on window focus disabled to reduce API calls
- Refetch on reconnect enabled
- Structural sharing enabled for better performance

**Error Handling Strategy**
The application uses a multi-layer error handling strategy:
- `RootErrorBoundary` wraps the entire application
- `RouteErrorBoundary` wraps individual routes
- Global error handlers for unhandled rejections and errors in production
- Specific error handling in hooks and components

### Navigating Key Components
**Authentication Flow**
Authentication is managed through:
- `src/lib/firebase/auth.ts` - Firebase authentication service
- `src/hooks/useAdminAuth.ts` - Hook for checking admin status
- `src/components/Auth.tsx` - Authentication UI component

**Routing Structure**
The application uses React Router with a comprehensive routing structure defined in `src/App.tsx`. Key routes include:
- Public pages (home, products, services, etc.)
- Authentication routes
- Dashboard routes for different user types
- Admin routes with protected access
- SEO landing pages

**Component Organization**
Components are organized by feature in the `src/components` directory with subdirectories for:
- `admin` - Admin-specific components
- `auth` - Authentication components
- `buyer` - Buyer-specific components
- `supplier` - Supplier-specific components
- `ui` - Reusable UI components from shadcn/ui
- Other feature-specific directories

**Section sources**
- [src/App.tsx](file://src/App.tsx#L1-L345)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L20)
- [vite.config.ts](file://vite.config.ts#L1-L215)
- [src/hooks/useAdminAuth.ts](file://src/hooks/useAdminAuth.ts#L1-L47)