# Database Backup & Recovery Procedures

## 📋 Overview

This document outlines backup procedures, recovery processes, and disaster recovery protocols for SleekApparels.

**Last Updated:** 2024-11-21  
**Owner:** DevOps Team

---

## 🔄 Automated Backups (Supabase)

### **Built-in Supabase Backups**

Supabase automatically handles database backups for all Lovable Cloud projects:

**Daily Backups:**
- Automatic daily backups at 02:00 UTC
- Retained for 7 days (Free tier) or 30 days (Pro tier)
- Point-in-time recovery (PITR) available on Pro tier

**Accessing Backups:**
1. Visit Supabase Dashboard
2. Navigate to Database > Backups
3. Select backup to restore
4. Choose restore options

---

## 💾 Manual Backup Procedures

### **Full Database Backup**

#### **Method 1: Using Supabase Dashboard**
1. Go to Supabase Dashboard
2. Navigate to Database > Backups
3. Click "Create Backup"
4. Add description and notes
5. Wait for backup completion
6. Download backup file

#### **Method 2: Using pg_dump (CLI)**
```bash
# Install PostgreSQL client tools
brew install postgresql  # macOS
sudo apt-get install postgresql-client  # Linux

# Get connection string from Supabase Dashboard
# Settings > Database > Connection String

# Create backup
pg_dump "postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/postgres" \
  --format=custom \
  --no-owner \
  --no-acl \
  > backup_$(date +%Y%m%d_%H%M%S).dump

# Compress backup
gzip backup_*.dump
```

#### **Method 3: Edge Function (Automated)**
```typescript
// Use the create-database-backup edge function
const { data, error } = await supabase.functions.invoke('create-database-backup', {
  body: {
    description: 'Pre-deployment backup',
    notify_email: 'admin@sleekapparels.com'
  }
});
```

---

## 🎯 Backup Schedule

### **Production Database**
- **Automated:** Daily at 02:00 UTC (Supabase)
- **Manual:** Before major deployments
- **Manual:** Before database migrations
- **Manual:** Before bulk data operations

### **Critical Tables** (Extra Backups)
Before operations on these tables, create manual backups:
- `orders`
- `payment_history`
- `invoices`
- `user_roles`
- `suppliers`
- `admin_audit_logs`

### **Pre-Deployment Checklist**
```bash
# 1. Create manual backup
npm run backup:create

# 2. Verify backup exists
npm run backup:verify

# 3. Test restore in staging (if available)
npm run backup:restore:test

# 4. Proceed with deployment
npm run deploy
```

---

## 🔧 Backup Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "backup:create": "node scripts/backup-database.js",
    "backup:verify": "node scripts/verify-backup.js",
    "backup:restore": "node scripts/restore-database.js",
    "backup:list": "node scripts/list-backups.js"
  }
}
```

---

## 📥 Recovery Procedures

### **Scenario 1: Restore Recent Data Loss**

**If data was deleted/corrupted in last 2 hours:**

1. **Quick Restore via Supabase Dashboard**
   ```
   Dashboard > Database > Point-in-time Recovery
   → Select timestamp before incident
   → Click "Restore"
   → Wait 5-15 minutes
   ```

2. **Verify restoration**
   ```sql
   -- Check data exists
   SELECT COUNT(*) FROM [affected_table];
   
   -- Check latest records
   SELECT * FROM [affected_table] 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

3. **Notify team**
   - Inform all team members
   - Document incident
   - Update incident log

---

### **Scenario 2: Major Database Corruption**

**If entire database is corrupted:**

1. **Assess Damage**
   ```sql
   -- Check table integrity
   SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::text)) 
   FROM pg_tables 
   WHERE schemaname = 'public';
   
   -- Check for corrupted data
   SELECT * FROM [table] WHERE [condition];
   ```

2. **Stop all write operations**
   ```bash
   # Disable edge functions that write data
   # Via Supabase: Functions > [function] > Disable
   
   # Put site in maintenance mode
   # Update environment variable: MAINTENANCE_MODE=true
   ```

3. **Restore from backup**
   ```bash
   # Using pg_restore
   pg_restore --clean --no-owner --no-acl \
     --dbname="postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/postgres" \
     backup_file.dump
   ```

4. **Verify restoration**
   ```sql
   -- Run comprehensive checks
   SELECT COUNT(*) FROM orders;
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM payment_history;
   
   -- Check data integrity
   SELECT * FROM orders 
   WHERE created_at > NOW() - INTERVAL '7 days';
   ```

5. **Resume operations**
   - Re-enable edge functions
   - Disable maintenance mode
   - Monitor error logs
   - Send all-clear notification

---

### **Scenario 3: Single Table Restoration**

**If only one table needs restoration:**

1. **Export table from backup**
   ```bash
   # Extract single table from backup
   pg_restore --table=orders \
     --data-only \
     backup_file.dump > orders_backup.sql
   ```

2. **Create temporary table**
   ```sql
   -- Create temp table for comparison
   CREATE TABLE orders_backup AS 
   SELECT * FROM orders;
   
   -- Drop corrupted table
   DROP TABLE orders CASCADE;
   ```

3. **Restore table**
   ```bash
   psql "postgres://[CONNECTION_STRING]" < orders_backup.sql
   ```

4. **Verify and rebuild relationships**
   ```sql
   -- Check foreign keys
   SELECT * FROM information_schema.table_constraints
   WHERE table_name = 'orders';
   
   -- Rebuild indexes
   REINDEX TABLE orders;
   ```

---

## 🚨 Disaster Recovery Plan

### **RTO (Recovery Time Objective): 2 hours**
### **RPO (Recovery Point Objective): 24 hours**

### **Critical Failure Scenarios**

#### **Scenario A: Complete Supabase Service Outage**

**Immediate Actions (0-15 min):**
1. Verify outage via [Supabase Status](https://status.supabase.com)
2. Activate incident response team
3. Put site in maintenance mode
4. Post status update for customers

**Recovery Actions (15 min - 2 hours):**
1. Contact Supabase support
2. Prepare to migrate to backup infrastructure
3. Export latest backup
4. Stand up emergency read-only mode if possible

**Communication:**
- Update status page every 30 minutes
- Email customers after 1 hour downtime
- Provide ETA when available

---

#### **Scenario B: Data Center Failure**

**Immediate Actions:**
1. Verify scope of failure
2. Check backup availability
3. Activate disaster recovery mode

**Recovery Actions:**
1. Deploy to alternate region (if configured)
2. Restore from most recent backup
3. Update DNS records
4. Test all critical functions

---

#### **Scenario C: Ransomware Attack**

**DO NOT:**
- Pay ransom immediately
- Delete anything
- Restore without scanning

**DO:**
1. Isolate affected systems
2. Contact law enforcement
3. Engage security team
4. Assess backup integrity
5. Restore from clean backup
6. Scan all systems before restart

---

## 🔍 Backup Verification

### **Weekly Verification Checklist**

```bash
# 1. Check backup exists
npm run backup:verify

# 2. Check backup size (should be consistent)
ls -lh backups/*.dump

# 3. Test restore in development
npm run backup:restore:dev

# 4. Verify data integrity
npm run backup:test:integrity

# 5. Document results
echo "$(date): Backup verified" >> backup_verification.log
```

### **Monthly Restoration Drill**

```bash
# 1. Schedule maintenance window
# 2. Create fresh backup
npm run backup:create

# 3. Restore in staging environment
npm run backup:restore:staging

# 4. Run automated tests
npm test

# 5. Verify critical workflows
# 6. Document lessons learned
```

---

## 📊 Backup Monitoring

### **Metrics to Track**
- Backup success rate (target: 100%)
- Backup size trend (detect anomalies)
- Backup duration (detect performance issues)
- Restoration test success rate
- Time to restore (track improvements)

### **Alerts to Configure**
1. **Backup failure** → Immediate alert to DevOps
2. **Backup size anomaly** → Warning alert
3. **Backup not created in 25 hours** → Critical alert
4. **Restoration test failed** → Critical alert

---

## 💼 Backup Storage

### **Primary Storage: Supabase**
- Automatic daily backups
- 7-day retention (Free) / 30-day retention (Pro)
- Encrypted at rest
- Geographic redundancy

### **Secondary Storage: External (Recommended)**

**AWS S3 Backup (Optional):**
```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure

# Upload backup to S3
aws s3 cp backup_file.dump s3://sleekapparels-backups/$(date +%Y-%m-%d)/

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket sleekapparels-backups \
  --versioning-configuration Status=Enabled
```

**Backup Encryption:**
```bash
# Encrypt backup before upload
gpg --symmetric --cipher-algo AES256 backup_file.dump

# Upload encrypted backup
aws s3 cp backup_file.dump.gpg s3://sleekapparels-backups/
```

---

## 📝 Backup Documentation

### **For Each Backup, Document:**
- Date and time
- Database size
- Number of records per table
- Reason for backup (scheduled/manual/pre-deployment)
- Created by
- Verified by
- Location of backup file

### **Backup Log Format:**
```
Date: 2024-11-21 02:00:00 UTC
Type: Automated Daily Backup
Size: 2.4 GB
Tables: 71
Records: 1,245,678
Status: Success
Verified: Yes (2024-11-21 02:15:00)
Location: Supabase + s3://sleekapparels-backups/2024-11-21/
Notes: Pre-deployment backup for v2.1.0 release
```

---

## 🎯 Best Practices

### **DO:**
✅ Create backup before every migration
✅ Test restoration quarterly
✅ Keep multiple backup copies
✅ Encrypt backups
✅ Document backup procedures
✅ Monitor backup success
✅ Train team on restoration

### **DON'T:**
❌ Trust only automated backups
❌ Store backups in same location as database
❌ Skip backup verification
❌ Delay restoration practice
❌ Forget to document incidents
❌ Keep backups indefinitely (compliance)

---

## 📞 Emergency Contacts

**Backup Issues:**
- DevOps Lead: [Contact]
- Supabase Support: support@supabase.com
- AWS Support: [ARN]

**Escalation Path:**
1. DevOps Team → 0-30 minutes
2. CTO → 30-60 minutes
3. External Support → 60+ minutes

---

## 🔄 Backup Lifecycle

```
┌─────────────────────────────────────────────┐
│         Backup Creation (Daily)             │
│    - Automated at 02:00 UTC                 │
│    - Manual before major changes            │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Backup Verification                  │
│    - Check integrity                         │
│    - Verify size                             │
│    - Test restoration (monthly)              │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Backup Storage                       │
│    - Supabase (primary)                      │
│    - S3 (secondary, optional)                │
│    - Encrypted and versioned                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Backup Retention                     │
│    - Keep 7-30 days (Supabase)               │
│    - Archive monthly (S3)                    │
│    - Comply with regulations                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Backup Deletion                      │
│    - Delete after retention period           │
│    - Secure deletion                         │
│    - Document destruction                    │
└─────────────────────────────────────────────┘
```

---

**Remember: Backups are only valuable if they can be restored. Test your restoration procedures regularly!**
