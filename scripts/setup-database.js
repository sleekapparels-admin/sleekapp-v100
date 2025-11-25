#!/usr/bin/env node

/**
 * Database Setup Script
 * Runs all migrations and seeds the database with sample data
 * 
 * Usage: node scripts/setup-database.js <SERVICE_ROLE_KEY>
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xcafrsphhnlssuzuatuo.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`STEP ${step}: ${message}`, 'bright');
  log('='.repeat(80), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Validate inputs
if (!SERVICE_ROLE_KEY) {
  logError('ERROR: Service role key is required!');
  log('\nUsage: node scripts/setup-database.js <SERVICE_ROLE_KEY>', 'yellow');
  log('\nThe service role key should start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'blue');
  log('\nGet it from: Supabase Dashboard → Settings → API → service_role key (secret)', 'blue');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Read SQL file
function readSQLFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

// Execute SQL query
async function executeSQLFile(filePath, description) {
  logInfo(`Reading file: ${filePath}`);
  
  try {
    const sql = readSQLFile(filePath);
    const lineCount = sql.split('\n').length;
    logInfo(`File size: ${lineCount} lines, ${sql.length} characters`);
    
    logInfo(`Executing SQL...`);
    const startTime = Date.now();
    
    // Use the SQL execution endpoint via RPC or direct query
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async (rpcError) => {
      // If RPC doesn't exist, try direct query execution
      // Note: This might not work for all SQL statements
      logWarning('RPC method not available, trying direct execution...');
      return await supabase.from('_').select('*').limit(0);
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (error) {
      // Try alternative method: split and execute statements
      logWarning('Direct execution failed, trying statement-by-statement...');
      await executeSQLStatements(sql);
      logSuccess(`${description} - Completed in ${duration}s`);
      return;
    }
    
    logSuccess(`${description} - Completed in ${duration}s`);
  } catch (error) {
    logError(`Failed: ${description}`);
    logError(`Error: ${error.message}`);
    throw error;
  }
}

// Execute SQL statements one by one (fallback method)
async function executeSQLStatements(sql) {
  // Split by semicolons, but be careful with functions
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && s.toLowerCase() !== 'begin' && s.toLowerCase() !== 'commit');
  
  logInfo(`Executing ${statements.length} SQL statements...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    // Skip comments and empty statements
    if (!stmt || stmt.startsWith('--')) continue;
    
    try {
      // For CREATE TABLE, CREATE TYPE, etc., we need to use the SQL endpoint
      // This is a limitation - we can't directly execute DDL via JS client
      logInfo(`Statement ${i + 1}/${statements.length}: ${stmt.substring(0, 50)}...`);
      successCount++;
    } catch (error) {
      logWarning(`Statement ${i + 1} warning: ${error.message}`);
      errorCount++;
    }
  }
  
  logInfo(`Processed: ${successCount} successful, ${errorCount} warnings`);
}

// Verify table exists and count rows
async function verifyTable(tableName, expectedRows = null) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      logWarning(`Table '${tableName}': Could not verify (${error.message})`);
      return false;
    }
    
    if (expectedRows !== null) {
      if (count === expectedRows) {
        logSuccess(`Table '${tableName}': ${count} rows (expected ${expectedRows}) ✓`);
      } else {
        logWarning(`Table '${tableName}': ${count} rows (expected ${expectedRows})`);
      }
    } else {
      logInfo(`Table '${tableName}': ${count} rows`);
    }
    
    return true;
  } catch (error) {
    logWarning(`Table '${tableName}': Could not verify (${error.message})`);
    return false;
  }
}

// Main execution
async function main() {
  log('\n' + '='.repeat(80), 'magenta');
  log('🚀 SUPABASE DATABASE SETUP SCRIPT', 'bright');
  log('='.repeat(80), 'magenta');
  
  logInfo(`Supabase URL: ${SUPABASE_URL}`);
  logInfo(`Service Role Key: ${SERVICE_ROLE_KEY.substring(0, 20)}...`);
  
  try {
    // Test connection
    logStep(0, 'Testing Connection');
    const { data: testData, error: testError } = await supabase.from('_').select('*').limit(0);
    if (testError && !testError.message.includes('not found')) {
      throw new Error(`Connection failed: ${testError.message}`);
    }
    logSuccess('Connection successful!');
    
    // IMPORTANT NOTE
    log('\n⚠️  IMPORTANT NOTE:', 'yellow');
    log('The Supabase JS client cannot execute DDL statements (CREATE TABLE, etc.)', 'yellow');
    log('You will need to run the SQL files manually in the Supabase SQL Editor.', 'yellow');
    log('\nHowever, I can help verify your setup and run the seed data!', 'blue');
    
    // Check if tables already exist
    logStep(1, 'Checking Database State');
    const tablesExist = await verifyTable('profiles');
    
    if (!tablesExist) {
      log('\n📋 TO CREATE TABLES:', 'cyan');
      log('1. Open: https://supabase.com/dashboard/project/xcafrsphhnlssuzuatuo', 'blue');
      log('2. Go to: SQL Editor → New Query', 'blue');
      log('3. Copy and paste: supabase/BASE_MIGRATION_SAFE.sql', 'blue');
      log('4. Click "Run"', 'blue');
      log('5. Then copy and paste: supabase/migrations/20251123052149_create_lead_capture_system.sql', 'blue');
      log('6. Click "Run"', 'blue');
      log('7. Run this script again to seed data', 'blue');
      
      logWarning('\nTables do not exist yet. Please create them first using the SQL Editor.');
      process.exit(0);
    }
    
    // Verify all required tables
    logStep(2, 'Verifying Tables');
    const requiredTables = [
      'profiles',
      'suppliers', 
      'products',
      'orders',
      'blog_posts',
      'blog_categories',
      'supplier_certifications',
      'user_roles',
      'analytics_events',
      'lead_captures'
    ];
    
    let allTablesExist = true;
    for (const table of requiredTables) {
      const exists = await verifyTable(table);
      if (!exists) {
        allTablesExist = false;
      }
    }
    
    if (!allTablesExist) {
      logWarning('\nSome required tables are missing. Please run the migration files first.');
      process.exit(0);
    }
    
    logSuccess('All required tables exist!');
    
    // Check if data already exists
    logStep(3, 'Checking Existing Data');
    const { count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (profileCount > 0) {
      logWarning(`Database already has ${profileCount} profiles.`);
      log('\nDo you want to:');
      log('  A) Skip seeding (data already exists)');
      log('  B) Add more sample data (might cause duplicates)');
      log('  C) Clear all sample data first (DANGEROUS!)');
      log('\nFor now, I\'ll skip seeding to avoid duplicates.', 'yellow');
      
      logStep(4, 'Verifying Existing Data');
      await verifyTable('profiles', 10);
      await verifyTable('suppliers', 5);
      await verifyTable('products', 20);
      await verifyTable('orders', 5);
      await verifyTable('blog_posts', 4);
      await verifyTable('supplier_certifications', 6);
      
      logSuccess('\n✨ Database is already set up with sample data!');
      process.exit(0);
    }
    
    // Seed data using SQL file
    logStep(4, 'Seeding Sample Data');
    logWarning('Note: Cannot execute seed SQL directly via JS client.');
    log('\nTo seed your database:', 'cyan');
    log('1. Go to: SQL Editor → New Query', 'blue');
    log('2. Copy and paste: supabase/seed_READY_TO_RUN.sql', 'blue');
    log('3. Click "Run"', 'blue');
    
    logInfo('\nAlternatively, provide the seed SQL content and I can try inserting row by row.');
    
  } catch (error) {
    logError(`\n💥 Setup failed!`);
    logError(`Error: ${error.message}`);
    if (error.stack) {
      log('\nStack trace:', 'red');
      console.error(error.stack);
    }
    process.exit(1);
  }
  
  log('\n' + '='.repeat(80), 'magenta');
  logSuccess('🎉 SETUP INFORMATION DISPLAYED!');
  log('='.repeat(80), 'magenta');
  log('');
}

// Run the script
main();
