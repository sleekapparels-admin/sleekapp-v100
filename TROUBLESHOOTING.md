# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the AI Quote Generator system. If you're experiencing problems, follow the steps below to identify and resolve them.

## AI Quote Generator Not Working

**Symptom:** Form submits but nothing happens - no code generates, no timeline generates, or the page appears frozen.

**Possible Causes and Fixes:**

- **Edge functions not deployed** → The system relies on Supabase Edge Functions that must be deployed to Lovable Cloud. See [EDGE_FUNCTION_DEPLOYMENT_GUIDE.md](EDGE_FUNCTION_DEPLOYMENT_GUIDE.md) for deployment instructions.
  
- **Missing environment variables** → Check that all required API keys are set in your Lovable project settings:
  - `RESEND_API_KEY` (for email OTP)
  - `LOVABLE_API_KEY` (for AI insights)
  - Supabase credentials (usually auto-set by Lovable)
  
  To verify: Go to Lovable Dashboard → Project Settings → Environment Variables.

- **Database not seeded** → The `quote_configurations` table needs pricing data. See [DATABASE_SEED_GUIDE.md](DATABASE_SEED_GUIDE.md) for seeding instructions.

- **Network/CORS issues** → Check browser console (F12 → Console tab) for errors like "CORS error" or "NetworkError". This usually indicates deployment issues with edge functions.

## OTP Not Received

**Symptom:** After submitting the quote form, no email arrives with the verification code.

**Possible Causes and Fixes:**

- **Check spam/junk folder** → OTP emails may be filtered as spam. Look for emails from "noreply@resend.dev" or similar.

- **Verify Resend API key is set** → The system uses Resend for email delivery. Ensure `RESEND_API_KEY` is configured in Lovable project settings.

- **Check Resend dashboard** → Log into [Resend Dashboard](https://resend.com/dashboard) to verify API key validity and check delivery status.

- **Verify email is not disposable** → Some email providers (like temp-mail.org) block transactional emails. Use a real email address.

- **Check rate limits** → Resend has sending limits. If exceeded, wait for reset or upgrade your plan. Check Resend dashboard for usage stats.

## Quote Generation Fails After OTP

**Symptom:** OTP verification succeeds, but quote generation fails with error messages or no output.

**Possible Causes and Fixes:**

- **Check if ai-quote-generator function is deployed** → This specific edge function handles quote generation. Verify deployment in Lovable Dashboard → Functions section.

- **Verify Lovable API key is set** → AI insights require `LOVABLE_API_KEY` in environment variables. Check Lovable project settings.

- **Check if quote_configurations table has data** → The system needs pricing data for different product types. Run queries in Supabase Dashboard to verify data exists.

- **Review function logs** → Check Lovable Dashboard → Functions → ai-quote-generator → Logs for error details. Look for API key issues, database connection problems, or AI service failures.

## Timeline Not Displaying

**Symptom:** Quote generates successfully, but the production timeline section is blank or shows errors.

**Possible Causes and Fixes:**

- **Check if timeline_predictions table exists** → Verify the table was created by running migrations. Check Supabase Dashboard → Tables.

- **Verify RLS policies allow access** → Row Level Security policies may block access. Ensure the service role key is used for edge functions, or check RLS policies in Supabase Dashboard.

- **Check browser console for errors** → Open F12 → Console tab and look for JavaScript errors related to timeline rendering or API calls.

## How to Check Logs

**Lovable Dashboard Logs:**
1. Go to your Lovable project dashboard
2. Navigate to Functions/Edge Functions section
3. Select the specific function (e.g., ai-quote-generator)
4. Click on "Logs" tab to view recent executions
5. Look for error messages, API failures, or timeout issues

**Browser Console:**
1. Open the application in your browser
2. Press F12 or right-click → Inspect
3. Go to Console tab
4. Perform the failing action (submit form, verify OTP, etc.)
5. Look for red error messages or network failures

**Network Tab:**
1. In browser dev tools (F12), go to Network tab
2. Perform the failing action
3. Look for failed requests (red status codes)
4. Check request/response details for API errors

## How to Test Each Component

**Test Supabase Connection:**
- Use the System Health Check component (add `?debug=true` to URL)
- Or run a simple query in Supabase Dashboard SQL Editor: `SELECT 1;`

**Test Each Edge Function Individually:**
- Use the diagnostic tools in System Health Check
- Or manually call functions via curl/Postman with test payloads
- Check function logs after each test

**Test Database Queries:**
- Go to Supabase Dashboard → SQL Editor
- Run: `SELECT * FROM quote_configurations LIMIT 5;`
- Verify tables exist and have expected data

**Test Frontend in Isolation:**
- Comment out API calls temporarily
- Use mock data to verify UI renders correctly
- Check for JavaScript errors in console

## Common Error Messages

- **"Failed to generate quote"** → Likely edge function deployment issue. Check if ai-quote-generator is deployed and logs show no errors.

- **"Invalid OTP"** → Check OTP expiration (5 minutes), remaining attempts (3 max), or if email was received. Try requesting a new OTP.

- **"Rate limit exceeded"** → Wait for the limit to reset (usually 1 hour) or consider upgrading your plan. Check Resend dashboard for email limits.

- **"Configuration not found"** → Database seeding issue. The quote_configurations table is missing data for the selected product type. See DATABASE_SEED_GUIDE.md.

## Getting Help

**Export Diagnostic Report:**
- Add `?debug=true` to the quote generator URL
- Click "System Diagnostics" button
- Click "Export Report" to copy diagnostic information
- Share this with support for faster resolution

**Information to Include When Asking for Help:**
- Browser and OS version
- Exact error messages (screenshots preferred)
- Steps to reproduce the issue
- Diagnostic report output
- Whether you're using Lovable Cloud or self-hosted Supabase

**Where to Find Logs:**
- Function logs: Lovable Dashboard → Functions → [function name] → Logs
- Browser errors: F12 → Console tab
- Network issues: F12 → Network tab → Failed requests

**How to Share Error Messages:**
- Take screenshots of error messages
- Copy console output (right-click → Copy message)
- Include timestamps and user actions that triggered the error
- Share diagnostic report when available

For additional support, refer to [ISSUES_AND_FIXES.md](ISSUES_AND_FIXES.md) for broader system issues. If problems persist, contact the development team with your diagnostic report.