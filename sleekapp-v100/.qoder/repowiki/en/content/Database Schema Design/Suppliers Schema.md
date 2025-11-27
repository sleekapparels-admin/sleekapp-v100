# Suppliers Schema

<cite>
**Referenced Files in This Document**  
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [supabase/seed_comprehensive_test_data.sql](file://supabase/seed_comprehensive_test_data.sql)
- [src/hooks/useSuppliers.ts](file://src/hooks/useSuppliers.ts)
- [src/pages/SupplierDirectory.tsx](file://src/pages/SupplierDirectory.tsx)
- [src/components/admin/SmartSupplierAssignment.tsx](file://src/components/admin/SmartSupplierAssignment.tsx)
- [src/integrations/supabase/types.ts](file://src/integrations/supabase/types.ts)
- [src/types/database.ts](file://src/types/database.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Suppliers Table Structure](#suppliers-table-structure)
3. [Entity Relationship Model](#entity-relationship-model)
4. [Field Definitions](#field-definitions)
5. [Business Rules and Constraints](#business-rules-and-constraints)
6. [Performance Metrics and Triggers](#performance-metrics-and-triggers)
7. [Data Access Patterns](#data-access-patterns)
8. [Security and Access Control](#security-and-access-control)
9. [Sample Data](#sample-data)
10. [Performance Considerations](#performance-considerations)

## Introduction
The suppliers table serves as the central entity for managing supplier profiles within the sleekapp-v100 database. This documentation provides a comprehensive overview of the suppliers schema, detailing its structure, relationships, business rules, and usage patterns across the application. The supplier management system enables efficient sourcing, quality tracking, and performance evaluation of manufacturing partners.

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [src/types/database.ts](file://src/types/database.ts)

## Suppliers Table Structure
The suppliers table contains comprehensive information about manufacturing partners, serving as the foundation for supplier management and selection processes. It maintains both operational and quality metrics to support data-driven supplier assignment decisions.

```mermaid
erDiagram
SUPPLIERS {
uuid id PK
string company_name
string contact_name
string email UK
string phone
string country
jsonb specialties
jsonb certifications
string verification_status
float rating
float on_time_delivery_rate
timestamp created_at
timestamp updated_at
}
SUPPLIER_CAPABILITIES {
uuid id PK
uuid supplier_id FK
jsonb production_methods
jsonb fabric_types
jsonb equipment
integer min_order_quantity
integer max_order_capacity
timestamp created_at
timestamp updated_at
}
FACTORY_CAPACITY {
uuid id PK
uuid supplier_id FK
date week_start
integer available_capacity
integer committed_capacity
string status
timestamp created_at
timestamp updated_at
}
SUPPLIER_ORDERS {
uuid id PK
uuid supplier_id FK
uuid order_id FK
timestamp assigned_at
timestamp confirmed_at
string status
jsonb performance_metrics
timestamp created_at
timestamp updated_at
}
SUPPLIERS ||--o{ SUPPLIER_CAPABILITIES : "has"
SUPPLIERS ||--o{ FACTORY_CAPACITY : "has"
SUPPLIERS ||--o{ SUPPLIER_ORDERS : "fulfills"
```

**Diagram sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [src/types/database.ts](file://src/types/database.ts)

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [src/types/database.ts](file://src/types/database.ts)

## Entity Relationship Model
The suppliers table forms the core of a comprehensive supplier management ecosystem, with multiple related entities that capture different aspects of supplier capabilities and performance. The entity relationship model demonstrates how supplier profiles are enriched with specialized data across different dimensions.

```mermaid
graph TD
Suppliers[Suppliers] --> SupplierCapabilities[Supplier Capabilities]
Suppliers --> FactoryCapacity[Factory Capacity]
Suppliers --> SupplierOrders[Supplier Orders]
SupplierOrders --> Orders[Orders]
SupplierCapabilities --> ProductionMethods[Production Methods]
SupplierCapabilities --> FabricTypes[Fabric Types]
FactoryCapacity --> CapacityPlanning[Capacity Planning]
style Suppliers fill:#f9f,stroke:#333
style SupplierCapabilities fill:#bbf,stroke:#333
style FactoryCapacity fill:#bbf,stroke:#333
style SupplierOrders fill:#bbf,stroke:#333
```

**Diagram sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [src/types/database.ts](file://src/types/database.ts)

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [src/types/database.ts](file://src/types/database.ts)

## Field Definitions
The suppliers table contains detailed information about each supplier, enabling comprehensive profile management and intelligent supplier matching.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| **company_name** | string | Legal name of the supplier company | NOT NULL, INDEX |
| **contact_name** | string | Primary contact person at the supplier | NULLABLE |
| **email** | string | Contact email address for the supplier | NOT NULL, UNIQUE, INDEX |
| **phone** | string | Contact phone number for the supplier | NULLABLE |
| **country** | string | Country where the supplier is based | NOT NULL, INDEX |
| **specialties** | jsonb | Array of product types and manufacturing specialties | NULLABLE, INDEX |
| **certifications** | jsonb | Array of quality and compliance certifications | NULLABLE, INDEX |
| **verification_status** | string | Current verification status (pending, verified, rejected) | NOT NULL, DEFAULT 'pending', INDEX |
| **rating** | float | Overall quality rating (0.0-5.0) | NOT NULL, DEFAULT 0.0, CHECK (0.0 <= rating <= 5.0) |
| **on_time_delivery_rate** | float | Percentage of on-time deliveries (0.0-1.0) | NOT NULL, DEFAULT 0.0, CHECK (0.0 <= on_time_delivery_rate <= 1.0) |
| **created_at** | timestamp | Record creation timestamp | NOT NULL, DEFAULT current_timestamp |
| **updated_at** | timestamp | Last update timestamp | NOT NULL, DEFAULT current_timestamp |

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [src/types/database.ts](file://src/types/database.ts)

## Business Rules and Constraints
The suppliers table enforces several business rules through database constraints to maintain data integrity and consistency across supplier profiles.

```mermaid
flowchart TD
A["Insert/Update Supplier"] --> B{Validation Rules}
B --> C["company_name: NOT NULL"]
B --> D["email: NOT NULL, UNIQUE"]
B --> E["country: NOT NULL"]
B --> F["verification_status: IN ('pending','verified','rejected')"]
B --> G["rating: 0.0 ≤ rating ≤ 5.0"]
B --> H["on_time_delivery_rate: 0.0 ≤ rate ≤ 1.0"]
C --> I["Apply Constraints"]
D --> I
E --> I
F --> I
G --> I
H --> I
I --> J["Update updated_at timestamp"]
J --> K["Commit Transaction"]
```

**Diagram sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

## Performance Metrics and Triggers
The supplier performance system automatically maintains quality metrics through database triggers that update supplier ratings and delivery performance based on order outcomes.

```mermaid
sequenceDiagram
participant O as OrderSystem
participant T as Trigger
participant S as Suppliers
participant L as AuditLog
O->>T : Update supplier_orders status to 'completed'
T->>T : execute update_supplier_performance_metrics()
T->>S : SELECT current rating and delivery rate
T->>S : Calculate new weighted rating
T->>S : Update on_time_delivery_rate
T->>S : UPDATE suppliers SET rating=new_rating, on_time_delivery_rate=new_rate
T->>L : INSERT audit log entry
T-->>O : Return success
```

The `update_supplier_performance_metrics()` trigger function automatically updates supplier performance metrics whenever a supplier order is completed. This trigger calculates a weighted average rating based on recent order performance and updates the on-time delivery rate based on fulfillment timelines.

**Diagram sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

## Data Access Patterns
The supplier data is accessed through various components in the application, with distinct patterns for different use cases.

```mermaid
flowchart LR
A[SupplierDirectory] --> B[Fetch suppliers with filters]
C[SmartSupplierAssignment] --> D[Query suppliers by capabilities]
E[SupplierProfile] --> F[Retrieve single supplier with relations]
G[AdminDashboard] --> H[Aggregate supplier metrics]
B --> I["SELECT * FROM suppliers WHERE country = ? AND specialties @> ? AND rating >= ?"]
D --> J["SELECT s.*, sc.* FROM suppliers s JOIN supplier_capabilities sc ON s.id = sc.supplier_id WHERE sc.production_methods @> ?"]
F --> K["SELECT s.*, json_agg(sc) as capabilities, json_agg(fc) as capacity FROM suppliers s LEFT JOIN supplier_capabilities sc ON s.id = sc.supplier_id LEFT JOIN factory_capacity fc ON s.id = fc.supplier_id WHERE s.id = ? GROUP BY s.id"]
H --> L["SELECT country, COUNT(*), AVG(rating), AVG(on_time_delivery_rate) FROM suppliers GROUP BY country"]
```

The SupplierDirectory component implements search and filtering functionality, while the SmartSupplierAssignment component uses capability-based queries to match suppliers with order requirements.

**Diagram sources**
- [src/pages/SupplierDirectory.tsx](file://src/pages/SupplierDirectory.tsx)
- [src/components/admin/SmartSupplierAssignment.tsx](file://src/components/admin/SmartSupplierAssignment.tsx)
- [src/hooks/useSuppliers.ts](file://src/hooks/useSuppliers.ts)

**Section sources**
- [src/pages/SupplierDirectory.tsx](file://src/pages/SupplierDirectory.tsx)
- [src/components/admin/SmartSupplierAssignment.tsx](file://src/components/admin/SmartSupplierAssignment.tsx)
- [src/hooks/useSuppliers.ts](file://src/hooks/useSuppliers.ts)

## Security and Access Control
Row Level Security (RLS) policies control access to supplier data based on user roles and permissions.

```mermaid
graph TD
A[User Request] --> B{User Role}
B --> |Admin| C["Full access to all suppliers"]
B --> |Buyer| D["Access to verified suppliers only"]
B --> |Supplier| E["Access to own profile only"]
B --> |Public| F["Access to basic info for verified suppliers"]
C --> G["SELECT * FROM suppliers"]
D --> H["SELECT * FROM suppliers WHERE verification_status = 'verified'"]
E --> I["SELECT * FROM suppliers WHERE id = current_user_supplier_id()"]
F --> J["SELECT company_name, country, specialties, rating, on_time_delivery_rate FROM suppliers WHERE verification_status = 'verified'"]
```

RLS policies ensure that sensitive supplier information is protected while allowing appropriate access for different user types.

**Diagram sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

## Sample Data
Example supplier profiles demonstrate the structure and content of the suppliers table.

```sql
-- Sample verified supplier
INSERT INTO suppliers (company_name, contact_name, email, phone, country, specialties, certifications, verification_status, rating, on_time_delivery_rate)
VALUES (
  'Premium Apparel Manufacturing Ltd.',
  'Sarah Chen',
  'sarah.chen@premiumapparel.com',
  '+880 1712-345678',
  'Bangladesh',
  '["woven shirts", "formal wear", "sustainable manufacturing"]'::jsonb,
  '["BSCI", "ISO 9001", "OEKO-TEX"]'::jsonb,
  'verified',
  4.8,
  0.96
);

-- Sample supplier with pending verification
INSERT INTO suppliers (company_name, contact_name, email, phone, country, specialties, certifications, verification_status, rating, on_time_delivery_rate)
VALUES (
  'New Horizon Textiles',
  'Mohammed Rahman',
  'info@newhorizontextiles.com',
  '+880 1911-223344',
  'Bangladesh',
  '["knitwear", "activewear", "cut-and-sew"]'::jsonb,
  '["STANDARD 100 by OEKO-TEX"]'::jsonb,
  'pending',
  0.0,
  0.0
);
```

**Section sources**
- [supabase/seed_comprehensive_test_data.sql](file://supabase/seed_comprehensive_test_data.sql)

## Performance Considerations
The suppliers table is optimized for search and filtering operations through strategic indexing and query patterns.

```mermaid
flowchart TD
A[Supplier Search] --> B{Query Type}
B --> |Country Filter| C["Use country_idx"]
B --> |Specialty Search| D["Use specialties_gin_idx"]
B --> |Rating Range| E["Use rating_idx"]
B --> |Verification Status| F["Use verification_status_idx"]
B --> |Full-Text Search| G["Use company_name_idx"]
C --> H["Index Scan on country_idx"]
D --> I["GIN Index Scan on specialties"]
E --> J["Index Scan on rating_idx"]
F --> K["Index Scan on verification_status_idx"]
G --> L["Index Scan on company_name_idx"]
H --> M["Return Results"]
I --> M
J --> M
K --> M
L --> M
```

The database schema includes multiple indexes to optimize common query patterns:
- B-tree index on `country` for geographic filtering
- GIN index on `specialties` for JSONB array containment queries
- B-tree index on `rating` for performance-based sorting
- B-tree index on `verification_status` for status filtering
- B-tree index on `company_name` for text search
- Unique index on `email` for constraint enforcement

**Diagram sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)

**Section sources**
- [supabase/migrations/20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)