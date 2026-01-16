# Codebase Optimization Plan

**Project:** Healthcare Charting Application  
**Date:** January 16, 2026  
**Estimated Total Time:** 13-19 hours  
**Total Steps:** 15 commits

---

## 📋 Overview

This document outlines a step-by-step plan to optimize the codebase focusing on:
- Database performance (indexes, query optimization)
- Code quality (removing console logs, magic strings)
- Component architecture (atomic design principles)
- Client-side performance (React Query, memoization)

Each step is designed to be a separate commit for clean version control.

---

## 🚀 Phase 1: Database Optimization (High Priority)

### Step 1: Add Database Indexes
**Commit:** `perf(db): add missing indexes to improve query performance`  
**Time:** 30 minutes  
**Files:** `prisma/schema.prisma`

**Changes:**
- Add index on `ChartingReport.createdById`
- Add composite index on `ChartingReport(status, createdAt)`
- Add composite index on `ChartingReport(cnaId, reportDate)`
- Add composite index on `ChartingSession(isActive, startTime)`
- Add index on `Resident.status`
- Add index on `Resident.assignedCNA`
- Add composite index on `User(role, isActive)`

**Commands:**
```bash
# After making changes
npx prisma format
npx prisma migrate dev --name add_performance_indexes
```

---

### Step 2: Add Pagination to CNA Accounts Endpoint
**Commit:** `perf(api): add pagination to CNA accounts endpoint`  
**Time:** 45 minutes  
**Files:** `src/app/api/admin/cna-accounts/route.ts`

**Changes:**
- Add pagination parameters (page, limit)
- Limit chartingSessions to most recent active session only
- Add total count to response
- Update to use centralized prisma instance from `@/lib/db`

---

### Step 3: Optimize Reports API Query
**Commit:** `perf(api): optimize reports endpoint with selective includes`  
**Time:** 30 minutes  
**Files:** `src/app/api/reports/route.ts`

**Changes:**
- Add optional `includeDetails` query parameter
- Only include CNA and createdBy relations when needed
- Add pagination support (limit, skip)
- Select only necessary fields from relations

---

### Step 4: Optimize Session API Queries
**Commit:** `perf(api): optimize session queries with field selection`  
**Time:** 30 minutes  
**Files:** `src/app/api/sessions/[id]/route.ts`, `src/app/api/sessions/route.ts`

**Changes:**
- Replace `include: { cna: true, user: true }` with selective field selection
- Use centralized prisma instance
- Only fetch required fields

---

### Step 5: Add Pagination to Residents Endpoint
**Commit:** `perf(api): add pagination and filtering to residents endpoint`  
**Time:** 45 minutes  
**Files:** `src/app/api/residents/route.ts` (if exists, or create it)

**Changes:**
- Add pagination (limit, skip)
- Add status filtering
- Add search functionality
- Limit default results to 100

---

## 🧹 Phase 2: Code Quality Improvements (Medium Priority)

### Step 6: Remove Console Statements
**Commit:** `chore: remove console statements and add proper logging`  
**Time:** 1 hour  
**Files:** Multiple files across `src/lib/`, `src/app/api/`, `src/hooks/`, `src/app/charting/`

**Changes:**
- Remove all `console.log` statements from production code
- Replace `console.error` in hooks with proper error handling
- Wrap debug logs in `if (process.env.NODE_ENV === 'development')` where needed
- Consider adding a logging utility for future use

**Files to update:**
- `src/lib/auth.ts`
- `src/lib/pdfExport.ts`
- `src/lib/initializeDefaults.ts`
- `src/app/api/charting/verify-password/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/charting/review/page.tsx`
- All hooks in `src/hooks/`

---

### Step 7: Create Constants File for Magic Strings
**Commit:** `refactor: extract magic strings to constants`  
**Time:** 45 minutes  
**Files:** Create `src/constants/charting.ts`, update multiple component files

**Changes:**
- Create `src/constants/charting.ts` with:
  - `ADL_TYPES` constant
  - `ASSISTANCE_LEVELS` constant
  - `SESSION_STEPS` constant
  - `ADL_LABELS` mapping
  - `ASSISTANCE_LABELS` mapping
- Update all files using hardcoded strings to import from constants

**Files to update:**
- `src/app/charting/adls/page.tsx`
- `src/app/charting/review/page.tsx`
- `src/components/pdf/ChartingReportPDF.tsx`
- Any other files with hardcoded ADL/assistance values

---

### Step 8: Add Request Validation with Zod
**Commit:** `feat: add request validation to API routes`  
**Time:** 1.5 hours  
**Files:** `src/app/api/reports/route.ts`, `src/app/api/sessions/route.ts`, others

**Changes:**
- Install Zod if not already: `npm install zod`
- Create validation schemas in `src/lib/validations/`
- Add validation to POST/PATCH endpoints
- Return proper validation errors

**Create:**
- `src/lib/validations/report.schema.ts`
- `src/lib/validations/session.schema.ts`
- `src/lib/validations/cna.schema.ts`

---

### Step 9: Standardize Error Handling
**Commit:** `refactor: standardize API error responses`  
**Time:** 1 hour  
**Files:** Create `src/lib/api-error.ts`, update all API routes

**Changes:**
- Create error response utility
- Standardize error format across all API routes
- Add proper HTTP status codes
- Include error codes for client-side handling

---

## ⚡ Phase 3: Client-Side Performance (Medium Priority)

### Step 10: Optimize React Query Configuration
**Commit:** `perf(client): optimize React Query with staleTime and cache settings`  
**Time:** 45 minutes  
**Files:** All hooks in `src/hooks/`

**Changes:**
- Add `staleTime: 5 * 60 * 1000` (5 minutes) to all queries
- Add `gcTime: 10 * 60 * 1000` (10 minutes) to all queries
- Remove unnecessary `invalidateQueries` calls where cache is already updated
- Fix `useCreateChartingReport` double-update issue

**Files to update:**
- `src/hooks/useResidents.ts`
- `src/hooks/useCNAs.ts`
- `src/hooks/useShifts.ts`
- `src/hooks/useShiftTemplates.ts`
- `src/hooks/useChartingReports.ts`
- `src/hooks/useChartingSession.ts`

---

### Step 11: Fix Hook Dependencies and Add Memoization
**Commit:** `perf(client): fix hook dependencies and add memoization`  
**Time:** 1 hour  
**Files:** `src/hooks/useChartingSession.ts`, `src/app/charting/adls/page.tsx`

**Changes:**
- Fix `updateSession` callback dependencies in `useChartingSession.ts`
- Add `useMemo` for `entriesByResident` in ADLs page
- Add `useMemo` for expensive computations in review page
- Optimize re-render triggers

---

## 🏗️ Phase 4: Component Architecture (Medium Priority)

### Step 12: Split ADLs Page into Atomic Components
**Commit:** `refactor(components): split ADLs page following atomic design`  
**Time:** 2 hours  
**Files:** Create new molecules, refactor `src/app/charting/adls/page.tsx`

**Create:**
- `src/components/molecules/ResidentSelector.molecule.tsx`
- `src/components/molecules/ADLSelector.molecule.tsx`
- `src/components/molecules/AssistanceForm.molecule.tsx`

**Changes:**
- Extract resident selection logic to molecule
- Extract ADL type selection to molecule
- Extract assistance form to molecule
- Keep page as orchestrator component (~80 lines)

---

### Step 13: Split Reports Detail Page into Molecules
**Commit:** `refactor(components): split reports detail page into molecules`  
**Time:** 2 hours  
**Files:** Create new molecules, refactor `src/app/admin/reports/[id]/page.tsx`

**Create:**
- `src/components/molecules/ReportHeader.molecule.tsx`
- `src/components/molecules/ReportMetadata.molecule.tsx`
- `src/components/molecules/ReportDetails.molecule.tsx`
- `src/components/molecules/ReportActions.molecule.tsx`

**Changes:**
- Extract header with status badge
- Extract metadata display
- Extract charting details display
- Extract action buttons
- Keep page as orchestrator (~100 lines)

---

### Step 14: Extract PDF Styles and Constants
**Commit:** `refactor(pdf): extract PDF styles and constants to separate files`  
**Time:** 1 hour  
**Files:** Create `src/styles/pdfStyles.ts`, refactor `src/components/pdf/ChartingReportPDF.tsx`

**Create:**
- `src/styles/pdfStyles.ts` - All StyleSheet.create() styles
- Use constants from Step 7 for ADL/assistance mappings

**Changes:**
- Move all PDF styles to separate file
- Import and use constants
- Simplify PDF component to ~150 lines

---

### Step 15: Extract Review Page Submission Logic
**Commit:** `refactor(hooks): extract review page submission logic to custom hook`  
**Time:** 1.5 hours  
**Files:** Create `src/hooks/useChartingReviewSubmit.ts`, refactor `src/app/charting/review/page.tsx`

**Create:**
- `src/hooks/useChartingReviewSubmit.ts` - Handle PDF generation and report creation

**Changes:**
- Move PDF generation logic to custom hook
- Move report creation logic to custom hook
- Move session ending logic to custom hook
- Simplify review page to ~120 lines

---

## 📊 Progress Tracking

Use this checklist to track your progress:

- [ ] Step 1: Database Indexes
- [ ] Step 2: CNA Accounts Pagination
- [ ] Step 3: Reports API Optimization
- [ ] Step 4: Session API Optimization
- [ ] Step 5: Residents Pagination
- [ ] Step 6: Remove Console Statements
- [ ] Step 7: Create Constants File
- [ ] Step 8: Add Zod Validation
- [ ] Step 9: Standardize Error Handling
- [ ] Step 10: React Query Optimization
- [ ] Step 11: Hook Dependencies & Memoization
- [ ] Step 12: Split ADLs Page
- [ ] Step 13: Split Reports Detail Page
- [ ] Step 14: Extract PDF Styles
- [ ] Step 15: Extract Review Submission Logic

---

## 🎯 Quick Wins (Do First if Time-Constrained)

If you want to see immediate impact, prioritize these steps:
1. **Step 1** - Database indexes (biggest performance boost)
2. **Step 6** - Remove console statements (security & cleanliness)
3. **Step 7** - Create constants (maintainability)
4. **Step 10** - React Query optimization (client performance)

---

## 📝 Testing After Each Step

After each commit, run:
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Run development server and test affected features
npm run dev
```

---

## 🔄 Optional: Future Improvements (Not in This Plan)

These were identified but are lower priority:
- Move PDF generation to API route (requires architecture change)
- Add soft delete support to models
- Migrate JSON fields to proper relations
- Create reusable atomic components (StatusBadge, ResidentCard, etc.)
- Add comprehensive error logging service (Sentry/LogRocket)

---

## 📞 Questions or Issues?

If you encounter any issues during implementation:
1. Check the detailed analysis in the context-gatherer report
2. Test each change in isolation
3. Revert if something breaks and reassess
4. Ask for help on specific steps

---

**Ready to start? Let's begin with Step 1! 🚀**
