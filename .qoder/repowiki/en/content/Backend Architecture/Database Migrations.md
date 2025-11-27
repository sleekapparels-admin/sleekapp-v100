# Database Migrations

<cite>
**Referenced Files in This Document**   
- [setup-database.js](file://scripts/setup-database.js)
- [COMPLETE_SETUP.sql](file://supabase/COMPLETE_SETUP.sql)
- [BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql)
- [create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql)
- [add_supplier_to_quotes.sql](file://supabase/migrations/add_supplier_to_quotes.sql)
- [seed.sql](file://supabase/seed.sql)
- [seed_MINIMAL.sql](file://supabase/seed_MINIMAL.sql)
- [seed_comprehensive_test_data.sql](file://supabase/seed_comprehensive_test_data.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Migration Strategy](#migration-strategy)
3. [Migration Execution Process](#migration-execution-process)
4. [Relationship Between Migration Files and Final Schema](#relationship-between-migration-files-and-final-schema)
5. [Best Practices for Writing Migrations](#best-practices-for-writing-migrations)
6. [Seeding Strategy](#seeding-strategy)
7. [Complex Migration Example](#complex-migration-example)
8. [Conclusion](#conclusion)

## Introduction
The database migration system in sleekapp-v100 is designed to manage the evolution of the database schema through timestamped SQL files. This system ensures that the database schema can be consistently and reliably updated across different environments. The migration process is orchestrated through the `setup-database.js` script, which handles the execution of migrations and seeding of data. The system includes a comprehensive set of migration files that define the schema changes, and seed files that populate the database with sample data for testing and development purposes.

**Section sources**
- [setup-database.js](file://scripts/setup-database.js)
- [COMPLETE_SETUP.sql](file://supabase/COMPLETE_SETUP.sql)

## Migration Strategy
The migration strategy in sleekapp-v100 is based on a series of timestamped SQL files located in the `supabase/migrations` directory. Each migration file is named with a timestamp prefix to ensure chronological execution. The migration files are designed to be idempotent, meaning they can be safely applied multiple times without causing errors. The migration process starts with the `BASE_MIGRATION_SAFE.sql` file, which sets up the initial schema, followed by subsequent migration files that add or modify the schema as needed.

Key migrations include:
- `20250122000000_create_marketplace_system.sql`: This migration creates the marketplace system, including tables for marketplace products, product categories, and product inquiries. It also sets up RLS policies to control access to the marketplace data.
- `20251123052149_create_lead_capture_system.sql`: This migration introduces the lead capture system, which collects early interest from potential users before they sign up. It includes tables for lead captures and analytics events, along with RLS policies to manage access.
- `add_supplier_to_quotes.sql`: This migration adds supplier assignment fields to the quotes table, allowing admins to assign suppliers to quotes and track the assignment history.

**Section sources**
- [BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql)
- [create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql)
- [add_supplier_to_quotes.sql](file://supabase/migrations/add_supplier_to_quotes.sql)

## Migration Execution Process
The migration execution process is managed by the `setup-database.js` script located in the `scripts` directory. This script is responsible for connecting to the Supabase database and executing the migration files in the correct order. The script takes the service role key as a command-line argument, which is used to authenticate with the database.

The script follows these steps:
1. **Connection Test**: The script first tests the connection to the database using the provided service role key.
2. **Schema Verification**: It checks if the required tables already exist in the database. If not, it provides instructions for manually creating the tables using the Supabase SQL Editor.
3. **Data Verification**: If the tables exist, the script verifies the presence of existing data. If data is already present, it skips the seeding process to avoid duplicates.
4. **Seeding**: If no data is present, the script provides instructions for seeding the database with sample data using the `seed_READY_TO_RUN.sql` file.

The script includes error handling and fallback mechanisms to ensure that the migration process can be resumed if it fails. For example, if the direct execution of SQL statements fails, the script falls back to executing statements one by one.

**Section sources**
- [setup-database.js](file://scripts/setup-database.js)

## Relationship Between Migration Files and Final Schema
The final database schema is the result of applying all the migration files in chronological order. The `COMPLETE_SETUP.sql` file is a comprehensive script that combines all the migration files into a single script, which can be used to set up the entire database in one go. This file is particularly useful for setting up a new database instance or for testing purposes.

The relationship between the migration files and the final schema is linear and cumulative. Each migration file builds upon the previous ones, adding new tables, modifying existing ones, or adding constraints and indexes. The `COMPLETE_SETUP.sql` file ensures that the final schema is consistent and complete, reflecting all the changes defined in the individual migration files.

**Section sources**
- [COMPLETE_SETUP.sql](file://supabase/COMPLETE_SETUP.sql)
- [BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql)

## Best Practices for Writing Migrations
When writing migrations for the sleekapp-v100 database, the following best practices should be followed:
- **Idempotency**: Migrations should be designed to be idempotent, meaning they can be safely applied multiple times without causing errors. This is achieved by using `IF NOT EXISTS` clauses when creating tables and indexes.
- **Atomicity**: Each migration should represent a single, atomic change to the schema. This makes it easier to roll back changes if needed.
- **Documentation**: Migrations should include comments that explain the purpose of the changes and any important details. This helps other developers understand the rationale behind the changes.
- **Testing**: Migrations should be thoroughly tested in a development environment before being applied to production. This includes testing the migration itself and verifying that the application continues to function correctly after the migration.
- **Rollback**: Migrations should include rollback instructions or scripts to revert the changes if necessary. This is particularly important for production environments.

**Section sources**
- [create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql)
- [add_supplier_to_quotes.sql](file://supabase/migrations/add_supplier_to_quotes.sql)

## Seeding Strategy
The seeding strategy in sleekapp-v100 involves using SQL files to populate the database with sample data. The repository includes several seed files, each designed for different use cases:
- `seed.sql`: This file contains a comprehensive set of sample data for testing and development. It includes sample users, suppliers, products, and orders.
- `seed_MINIMAL.sql`: This file contains a minimal set of sample data, including only the essential users and data needed for basic testing.
- `seed_comprehensive_test_data.sql`: This file contains a comprehensive set of test data, including realistic orders with production stages for testing the order tracking and production management features.

The seeding process is typically performed after the migration files have been applied. The `setup-database.js` script provides instructions for manually running the seed files in the Supabase SQL Editor.

**Section sources**
- [seed.sql](file://supabase/seed.sql)
- [seed_MINIMAL.sql](file://supabase/seed_MINIMAL.sql)
- [seed_comprehensive_test_data.sql](file://supabase/seed_comprehensive_test_data.sql)

## Complex Migration Example
A complex migration example is the `add_supplier_to_quotes.sql` file, which adds supplier assignment fields to the quotes table. This migration is complex because it involves modifying an existing table and adding new columns that reference other tables. The migration also includes the creation of indexes to improve query performance and the addition of comments to document the purpose of the new columns.

The migration script is as follows:
```sql
-- Migration: Add supplier assignment fields to quotes table
-- Purpose: Allow admins to assign suppliers to quotes and track assignment history
-- Date: 2025-11-24

-- Add supplier assignment columns to quotes table
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for faster supplier quote lookups
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quotes_assigned_at ON quotes(assigned_at);

-- Add comment for documentation
COMMENT ON COLUMN quotes.supplier_id IS 'The supplier assigned to fulfill this quote by the admin';
COMMENT ON COLUMN quotes.assigned_at IS 'Timestamp when the supplier was assigned to this quote';
COMMENT ON COLUMN quotes.assigned_by IS 'Admin user who assigned the supplier to this quote';

-- Update existing quotes to have 'pending' status if they don't have a status
UPDATE quotes SET status = 'pending' WHERE status IS NULL OR status = '';

-- Add status index for faster filtering
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Success message
SELECT 'Migration completed successfully: supplier assignment fields added to quotes table' AS status;
```

This migration ensures that the quotes table can now track which supplier has been assigned to fulfill a quote, when the assignment was made, and by which admin user. The addition of indexes improves query performance, and the comments provide documentation for future reference.

**Section sources**
- [add_supplier_to_quotes.sql](file://supabase/migrations/add_supplier_to_quotes.sql)

## Conclusion
The database migration system in sleekapp-v100 is a robust and well-structured approach to managing schema evolution. By using timestamped SQL files and a dedicated script for execution, the system ensures that the database schema can be consistently and reliably updated. The inclusion of comprehensive seed files and best practices for writing migrations further enhances the reliability and maintainability of the system. This approach not only supports the development and testing processes but also ensures that the production environment remains stable and secure.