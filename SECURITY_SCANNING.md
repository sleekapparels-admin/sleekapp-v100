# Security Scanning & Vulnerability Management

## 📋 Overview

This document outlines security scanning procedures, tools, and best practices for identifying and remediating vulnerabilities.

**Last Updated:** 2024-11-21  
**Owner:** Security Team

---

## 🔍 Types of Security Scans

### **1. Dependency Scanning**
Identify vulnerabilities in third-party packages and dependencies.

### **2. Static Application Security Testing (SAST)**
Analyze source code for security vulnerabilities without executing the code.

### **3. Dynamic Application Security Testing (DAST)**
Test running application for security vulnerabilities.

### **4. Database Security Scanning**
Check database configuration, RLS policies, and access controls.

### **5. Infrastructure Scanning**
Scan cloud infrastructure and configurations for security issues.

---

## 🛠️ Security Scanning Tools

### **Dependency Scanning**

#### **npm audit (Built-in)**
```bash
# Run security audit
npm audit

# Show detailed report
npm audit --json

# Fix automatically (use with caution)
npm audit fix

# Fix only production dependencies
npm audit fix --only=prod

# Skip breaking changes
npm audit fix --force
```

**Schedule:** 
- Run before every deployment
- Run weekly automatically
- Run after adding new dependencies

---

#### **Snyk (Recommended)**
```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor

# Test and fix
snyk wizard
```

**Features:**
- Real-time vulnerability database
- Automatic fix PRs
- License compliance checking
- Container scanning
- Infrastructure as Code scanning

---

### **Code Quality & Security**

#### **ESLint with Security Plugins**
```bash
# Install security plugins
npm install --save-dev \
  eslint-plugin-security \
  eslint-plugin-no-secrets

# Add to .eslintrc.json
{
  "plugins": ["security", "no-secrets"],
  "extends": ["plugin:security/recommended"]
}

# Run lint
npm run lint

# Fix automatically
npm run lint -- --fix
```

---

#### **SonarQube / SonarCloud**
```bash
# Install scanner
npm install --save-dev sonarqube-scanner

# Configure sonar-project.properties
sonar.projectKey=sleekapparels
sonar.organization=your-org
sonar.sources=src
sonar.exclusions=**/node_modules/**,**/*.test.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Run scan
npx sonar-scanner
```

---

### **Database Security**

#### **Supabase Linter**
```bash
# Already integrated - check via Lovable UI
# Or via Supabase CLI

supabase db lint

# Common checks:
# - RLS policies enabled
# - No public write access
# - Proper auth checks
# - No SQL injection vulnerabilities
```

---

### **Secret Scanning**

#### **git-secrets**
```bash
# Install
brew install git-secrets  # macOS
# OR
git clone https://github.com/awslabs/git-secrets
cd git-secrets && make install

# Setup
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'SUPABASE_[A-Z_]*_KEY'
git secrets --add 'STRIPE_[A-Z_]*_KEY'
git secrets --add 'API_KEY.*=.*[A-Za-z0-9]+'

# Scan repository
git secrets --scan

# Scan history
git secrets --scan-history
```

---

#### **TruffleHog**
```bash
# Install
pip install trufflehog

# Scan repository
trufflehog git file://. --json

# Scan specific branch
trufflehog git file://. --branch main

# Scan with regex rules
trufflehog --regex --entropy=False git file://.
```

---

## 📅 Scanning Schedule

### **Daily (Automated)**
- ✅ Dependency vulnerability check (npm audit)
- ✅ Secret scanning on commits (git-secrets)
- ✅ Lint security checks (ESLint)

### **Weekly (Automated)**
- ✅ Full dependency audit (Snyk)
- ✅ Database security scan (Supabase linter)
- ✅ Code quality scan (SonarQube)

### **Monthly (Manual)**
- ✅ Comprehensive security review
- ✅ Penetration testing
- ✅ Third-party security audit
- ✅ Infrastructure review

### **Before Deployment (Mandatory)**
- ✅ npm audit
- ✅ ESLint security checks
- ✅ Supabase linter
- ✅ Review recent dependency updates

---

## 🎯 Vulnerability Management

### **Severity Levels**

#### **Critical (CVSS 9.0-10.0)**
- **Action:** Fix immediately (within 24 hours)
- **Examples:** RCE, Authentication bypass, SQLi
- **Response:** 
  - Stop deployment
  - Emergency patch
  - Security advisory

#### **High (CVSS 7.0-8.9)**
- **Action:** Fix within 7 days
- **Examples:** XSS, CSRF, Data exposure
- **Response:**
  - Schedule emergency fix
  - Test thoroughly
  - Deploy with monitoring

#### **Medium (CVSS 4.0-6.9)**
- **Action:** Fix within 30 days
- **Examples:** Information disclosure, DoS
- **Response:**
  - Schedule in sprint
  - Include in next release
  - Document mitigation

#### **Low (CVSS 0.1-3.9)**
- **Action:** Fix within 90 days
- **Examples:** Minor information leak, Config issue
- **Response:**
  - Add to backlog
  - Fix when convenient
  - Document workaround

---

### **Vulnerability Response Workflow**

```
┌──────────────────────────────────────────┐
│   1. Vulnerability Detected              │
│   (via scan or disclosure)               │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   2. Triage & Assess                     │
│   - Severity (CVSS)                      │
│   - Exploitability                       │
│   - Impact                               │
│   - Affected systems                     │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   3. Prioritize                          │
│   Critical → High → Medium → Low         │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   4. Remediate                           │
│   - Update dependency                    │
│   - Apply patch                          │
│   - Implement workaround                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   5. Verify Fix                          │
│   - Test fix                             │
│   - Re-scan                              │
│   - Confirm vulnerability closed         │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   6. Deploy & Monitor                    │
│   - Deploy to production                 │
│   - Monitor for exploitation attempts    │
│   - Update documentation                 │
└──────────────────────────────────────────┘
```

---

## 🔧 Automated Security Scanning

### **GitHub Actions Workflow**

Create `.github/workflows/security-scan.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

  lint-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint security checks
        run: npm run lint

  database-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check Supabase RLS policies
        run: |
          # Add custom script to validate RLS policies
          node scripts/check-rls-policies.js
```

---

## 📊 Security Metrics & Reporting

### **Track These Metrics**

1. **Vulnerability Count**
   - Total vulnerabilities by severity
   - New vs. fixed vulnerabilities
   - Time to fix by severity

2. **Scan Coverage**
   - % of codebase scanned
   - % of dependencies scanned
   - Scan frequency

3. **Remediation Time**
   - Average time to fix by severity
   - SLA compliance rate
   - Backlog age

4. **False Positive Rate**
   - Dismissed vulnerabilities
   - False positive reasons
   - Scanner accuracy

---

### **Monthly Security Report Template**

```markdown
# Security Scan Report - [Month Year]

## Executive Summary
- Total vulnerabilities found: [X]
- Critical: [X] | High: [X] | Medium: [X] | Low: [X]
- Vulnerabilities fixed: [X]
- Average remediation time: [X] days

## Scan Results

### Dependency Vulnerabilities
- npm audit: [X] vulnerabilities
- Snyk: [X] vulnerabilities
- Top vulnerable packages:
  1. [package-name]: [severity] - [description]
  2. [package-name]: [severity] - [description]

### Code Security Issues
- ESLint security warnings: [X]
- SonarQube security hotspots: [X]
- Most common issues:
  1. [Issue type]: [count]
  2. [Issue type]: [count]

### Database Security
- RLS policy violations: [X]
- Public write access issues: [X]
- Recommendations: [List]

### Infrastructure
- Supabase configuration issues: [X]
- Secret exposure risks: [X]
- Recommendations: [List]

## Actions Taken
1. [Action taken] - [Date] - [Owner]
2. [Action taken] - [Date] - [Owner]

## Outstanding Items
1. [Issue] - [Severity] - [ETA] - [Owner]
2. [Issue] - [Severity] - [ETA] - [Owner]

## Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## 🎓 Security Scanning Best Practices

### **DO:**
✅ Scan before every deployment
✅ Automate scanning in CI/CD
✅ Fix critical vulnerabilities immediately
✅ Review scan results regularly
✅ Keep dependencies up to date
✅ Monitor security advisories
✅ Document false positives
✅ Test fixes before deployment

### **DON'T:**
❌ Ignore scan results
❌ Disable security checks
❌ Skip vulnerability assessment
❌ Use outdated dependencies
❌ Trust only one scanning tool
❌ Deploy with known critical vulnerabilities
❌ Forget to re-scan after fixes

---

## 🔗 Resources

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk documentation](https://docs.snyk.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CVE Database](https://cve.mitre.org/)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)

---

## 📝 Quick Reference

### **Pre-Deployment Security Checklist**
```bash
# 1. Dependency audit
npm audit --audit-level=moderate

# 2. Run tests
npm test

# 3. Lint checks
npm run lint

# 4. Type check
npm run type-check

# 5. Database lint (if migrations)
# Check via Lovable UI or Supabase Dashboard

# 6. Secret scan (if new code)
git secrets --scan

# 7. Review changes
git diff main..HEAD

# ✅ All clear? Proceed with deployment
```

---

**Remember: Security scanning is continuous, not one-time. Integrate scanning into your development workflow!**
