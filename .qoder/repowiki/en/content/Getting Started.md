# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [scripts/setup-database.js](file://scripts/setup-database.js)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts)
- [supabase/config.toml](file://supabase/config.toml)
- [vite.config.ts](file://vite.config.ts)
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [supabase/BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql)
- [supabase/seed_READY_TO_RUN.sql](file://supabase/seed_READY_TO_RUN.sql)
- [supabase/migrations/20251123052149_create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project Structure Overview](#project-structure-overview)
4. [Environment Setup](#environment-setup)
5. [Database Configuration](#database-configuration)
6. [Application Setup](#application-setup)
7. [Development Workflow](#development-workflow)
8. [Common Issues and Solutions](#common-issues-and-solutions)
9. [Advanced Configuration](#advanced-configuration)
10. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction

Sleek Apparels is a comprehensive knitwear manufacturing and supply chain management platform featuring AI-powered production tracking (LoopTrace™ Technology) and intelligent quote generation. This guide will walk you through setting up the development environment for sleekapp-v100, covering everything from initial setup to advanced configuration.

The platform combines modern frontend technologies with robust backend infrastructure, utilizing React 18, TypeScript, Vite, Supabase, and shadcn/ui for a seamless development experience.

## Prerequisites

Before starting the setup process, ensure you have the following prerequisites installed:

### Required Software
- **Node.js 18+**: JavaScript runtime environment
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control system
- **Supabase Account**: For backend services
- **Lovable Account**: For deployment (optional but recommended)

### Recommended Tools
- **Code Editor**: VS Code, WebStorm, or your preferred editor
- **Browser**: Chrome, Firefox, or Edge for testing
- **Terminal/Command Line**: For running commands

**Section sources**
- [README.md](file://README.md#L86-L90)
- [package.json](file://package.json#L1-L10)

## Project Structure Overview

Understanding the project structure is crucial for effective development. Here's a high-level overview of the key directories and their purposes:

```mermaid
graph TB
subgraph "Root Directory"
A[src/] --> B[components/]
A --> C[pages/]
A --> D[integrations/]
A --> E[lib/]
A --> F[hooks/]
G[supabase/] --> H[migrations/]
G --> I[functions/]
G --> J[seed.sql]
K[scripts/] --> L[setup-database.js]
M[public/] --> N[videos/]
M --> O[images/]
end
subgraph "Configuration"
P[vite.config.ts]
Q[package.json]
R[tsconfig.json]
end
```

**Diagram sources**
- [README.md](file://README.md#L1-L50)

### Key Directories Explained

- **`src/`**: Contains all TypeScript/React source code
  - `components/`: Reusable UI components organized by feature
  - `pages/`: Route-specific page components
  - `integrations/`: Third-party service integrations (Supabase, Firebase)
  - `lib/`: Utility libraries and helpers
  - `hooks/`: Custom React hooks

- **`supabase/`**: Supabase database configuration and migrations
  - `migrations/`: Database schema evolution scripts
  - `functions/`: Edge functions for serverless logic
  - `seed.sql`: Sample data for development

- **`scripts/`**: Automation and setup scripts
  - `setup-database.js`: Database initialization script

- **`public/`**: Static assets served directly by the web server

**Section sources**
- [README.md](file://README.md#L1-L100)

## Environment Setup

### Step 1: Create Environment Variables

The application requires several environment variables for proper functioning. Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Environment Variable Details

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://eqpftggctumujhutomom.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Admin API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Environment Validation

The application includes built-in validation for environment variables:

```mermaid
flowchart TD
A[Application Start] --> B[Load Environment]
B --> C{Validate Required Variables}
C --> |Missing| D[Throw Error]
C --> |Valid| E[Validate URL Format]
E --> F{URL Valid?}
F --> |Invalid| D
F --> |Valid| G[Validate Keys]
G --> H{Keys Valid?}
H --> |Invalid| D
H --> |Valid| I[Environment Ready]
D --> J[Application Crashes]
I --> K[Continue Startup]
```

**Diagram sources**
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L25-L48)

**Section sources**
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L1-L143)
- [vite.config.ts](file://vite.config.ts#L80-L85)

## Database Configuration

### Understanding Supabase Setup

Sleekapp-v100 uses Supabase as its backend infrastructure, providing PostgreSQL database, authentication, real-time subscriptions, and edge functions.

### Migration System

The database uses a sophisticated migration system with multiple migration files:

```mermaid
graph LR
A[BASE_MIGRATION_SAFE.sql] --> B[Production Tables]
B --> C[20251123052149_create_lead_capture_system.sql]
C --> D[Lead Capture System]
D --> E[Additional Migrations]
E --> F[Final Schema]
G[seed_READY_TO_RUN.sql] --> H[Sample Data]
H --> I[Users & Profiles]
I --> J[Suppliers & Products]
J --> K[Orders & Analytics]
```

**Diagram sources**
- [supabase/BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql#L1-L200)
- [supabase/migrations/20251123052149_create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql#L1-L50)

### Running Database Setup

The project includes an automated database setup script that handles the complex process of migrating and seeding the database:

#### Step-by-Step Database Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Setup Script**:
   ```bash
   node scripts/setup-database.js <SERVICE_ROLE_KEY>
   ```

3. **Manual Migration Steps**:
   Since the Supabase JavaScript client cannot execute DDL statements directly, you'll need to manually run SQL migrations:

   a. **Open Supabase SQL Editor**:
   - Navigate to your Supabase dashboard
   - Go to "SQL Editor" → "New Query"

   b. **Run BASE Migration**:
   - Copy content from `supabase/BASE_MIGRATION_SAFE.sql`
   - Execute the SQL statements

   c. **Run Additional Migrations**:
   - Execute subsequent migration files as needed

4. **Seed Data**:
   - Run `supabase/seed_READY_TO_RUN.sql` in the SQL Editor
   - This creates sample users, suppliers, and products

### Database Schema Overview

The database includes several key tables:

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User account information | Full name, email, company details |
| `suppliers` | Supplier business information | Capacity, ratings, certifications |
| `products` | Product catalog | Descriptions, images, categories |
| `orders` | Order management | Status tracking, supplier assignments |
| `lead_captures` | Marketing leads | Contact information, interests |
| `analytics_events` | User analytics | Event tracking, user behavior |

**Section sources**
- [scripts/setup-database.js](file://scripts/setup-database.js#L1-L308)
- [supabase/BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql#L1-L200)
- [supabase/seed_READY_TO_RUN.sql](file://supabase/seed_READY_TO_RUN.sql#L1-L200)

## Application Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd sleek-apparels

# Install dependencies
npm install
```

### Step 2: Configure Environment

Create a `.env.local` file with your Supabase credentials:

```bash
# Supabase configuration
VITE_SUPABASE_URL=https://eqpftggctumujhutomom.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGZ0Z2djdHVtdWpodXRvbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc5NzAsImV4cCI6MjA3ODc0Mzk3MH0.7KkuzAPJlU7PR6lOIKi_zZi31oUhWk_MGUzYhxGYehw
```

### Step 3: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Development Server Configuration

The Vite development server is configured with several optimizations:

```mermaid
graph TB
A[Vite Dev Server] --> B[Hot Module Replacement]
A --> C[Fast Refresh]
A --> D[Asset Optimization]
B --> E[Live Code Updates]
C --> F[UI State Preservation]
D --> G[Automatic Imports]
H[Build Optimizations] --> I[Code Splitting]
H --> J[Tree Shaking]
H --> K[Bundle Analysis]
```

**Diagram sources**
- [vite.config.ts](file://vite.config.ts#L12-L30)

**Section sources**
- [README.md](file://README.md#L91-L110)
- [vite.config.ts](file://vite.config.ts#L1-L216)

## Development Workflow

### Project Initialization

The application follows a structured initialization process:

```mermaid
sequenceDiagram
participant U as User
participant M as main.tsx
participant E as env-validator
participant S as Supabase Client
participant A as App
U->>M : Start Application
M->>E : Validate Environment
E->>E : Check Required Variables
E->>E : Validate URL Format
E->>E : Validate API Keys
E-->>M : Environment Valid
M->>S : Initialize Supabase
S-->>M : Client Ready
M->>A : Render Application
A-->>U : Application Loaded
```

**Diagram sources**
- [src/main.tsx](file://src/main.tsx#L1-L39)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L29-L48)

### Key Initialization Features

1. **Environment Validation**: Automatic checking of required variables
2. **Performance Optimizations**: Lazy loading and code splitting
3. **Error Boundaries**: Robust error handling for production
4. **Analytics Integration**: Built-in analytics tracking

### Running the Application

After completing the setup steps, you can start developing:

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Section sources**
- [src/main.tsx](file://src/main.tsx#L1-L39)
- [src/App.tsx](file://src/App.tsx#L1-L200)

## Common Issues and Solutions

### Environment Variable Problems

**Issue**: Missing or invalid environment variables
**Solution**: 
1. Verify `.env.local` file exists in project root
2. Check variable names match exactly (`VITE_SUPABASE_URL`)
3. Ensure values are correct and not truncated

### Database Connection Issues

**Issue**: Cannot connect to Supabase
**Solution**:
1. Verify Supabase URL is correct
2. Check network connectivity
3. Ensure service role key has proper permissions
4. Verify database is running in Supabase dashboard

### Migration Failures

**Issue**: SQL migrations fail to execute
**Solution**:
1. Manually run migration files in Supabase SQL Editor
2. Check for syntax errors in SQL files
3. Verify database user permissions
4. Ensure all dependencies are installed

### Build Errors

**Issue**: TypeScript or build errors
**Solution**:
1. Run `npm install` to update dependencies
2. Check TypeScript configuration
3. Verify all required packages are installed
4. Clear node_modules and reinstall if needed

**Section sources**
- [scripts/setup-database.js](file://scripts/setup-database.js#L56-L62)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L56-L61)

## Advanced Configuration

### Customizing the Setup Script

The database setup script can be customized for different environments:

```javascript
// Custom configuration options
const CONFIG = {
  // Custom Supabase URL
  SUPABASE_URL: process.env.CUSTOM_SUPABASE_URL,
  
  // Custom service role key
  SERVICE_ROLE_KEY: process.env.CUSTOM_SERVICE_ROLE_KEY,
  
  // Custom seed data options
  SEED_OPTIONS: {
    includeTestData: true,
    includeDemoData: false,
    cleanExistingData: false
  }
};
```

### Performance Optimizations

The application includes several performance optimizations:

- **Code Splitting**: Automatic chunking of vendor libraries
- **Lazy Loading**: Dynamic imports for non-critical components
- **Asset Optimization**: Compressed images and optimized bundles
- **Caching**: Intelligent caching strategies for API calls

### Security Considerations

- **Environment Variables**: Never commit sensitive data to version control
- **Service Role Keys**: Use separate keys for different environments
- **Database Permissions**: Implement proper RLS policies
- **HTTPS**: Ensure production deployments use HTTPS

**Section sources**
- [scripts/setup-database.js](file://scripts/setup-database.js#L15-L17)
- [vite.config.ts](file://vite.config.ts#L103-L208)

## Troubleshooting Guide

### Getting Help

If you encounter issues during setup:

1. **Check the Console**: Look for error messages in browser developer tools
2. **Verify Dependencies**: Ensure all npm packages are installed correctly
3. **Review Logs**: Check terminal output for setup script errors
4. **Consult Documentation**: Review Supabase and Vite documentation
5. **Community Support**: Reach out to development community

### Debugging Tips

- **Enable Verbose Logging**: Set environment variables for detailed logging
- **Test Incrementally**: Verify each setup step individually
- **Clean Installation**: Remove node_modules and reinstall if problems persist
- **Check Network**: Ensure firewall allows connections to Supabase

### Recovery Procedures

If setup fails:

1. **Reset Database**: Drop and recreate the database
2. **Clear Cache**: Clear browser cache and application data
3. **Restart Services**: Restart development server and database
4. **Reinstall Dependencies**: Clean npm cache and reinstall packages

**Section sources**
- [scripts/setup-database.js](file://scripts/setup-database.js#L290-L307)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L134-L142)