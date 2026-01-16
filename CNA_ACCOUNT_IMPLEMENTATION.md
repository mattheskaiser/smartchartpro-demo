# CNA Account Management & Session System Implementation Plan

## Overview

Implement a complete authentication and session management system for CNAs (Certified Nursing Assistants) that allows them to log in, conduct charting sessions, and ensures proper session lifecycle management.

## Core Requirements

### User Roles

- **ADMIN**: Full access to all routes, can manage CNA accounts, view all reports
- **CNA**: Limited access to charting routes only, cannot see PDF reports

### CNA Access Restrictions

- CNAs can ONLY access these 3 routes:
  1. `/charting/start` - Select residents and start session
  2. `/charting/adls` - Daily charting activities
  3. `/charting/review` - Review their work and end session
- CNAs NEVER see PDF reports (admin-only feature)
- CNAs can only see their current charting work, not historical reports

### Session Rules

1. **One Session Per CNA**: A CNA can only have ONE active session at a time
2. **Session Persistence**: If a CNA logs out without ending the session, they resume where they left off on next login
3. **Manual Session End**: Sessions must be manually ended - this is what triggers report generation
4. **Session Blocking**: Cannot start a new session until the previous one is properly ended
5. **Multiple CNAs**: Multiple different CNAs can have active sessions simultaneously (just not the same CNA twice)

### Authentication Flow

1. CNA logs in with email/password
2. System checks for existing active session:
   - If active session exists → redirect to appropriate charting page (start/adls/review based on progress)
   - If no active session → redirect to `/charting/start`
3. On `/charting/start`:
   - CNA selection dropdown is REMOVED (determined by logged-in account)
   - CNA selects residents only
   - Clicks "Start Session" button → creates active session record
4. CNA works through charting flow
5. On `/charting/review`:
   - CNA reviews their work
   - Clicks "End Session" button → marks session complete, generates report, logs out

### Admin Capabilities

- Create CNA accounts (email + temporary password)
- View all CNA accounts and their status
- Reset CNA passwords
- **Master Password Access**: Admins can log into any CNA account using a master password
  - Use case: CNA forgot to end session, admin can log in as them and end it
  - Admin does NOT see the CNA's actual password
- View active sessions dashboard (who's charting right now)
- Deactivate/reactivate CNA accounts

### Password Management

- CNAs receive temporary password on account creation
- CNAs can change their own password after first login
- Admins can reset CNA passwords at any time
- Admins use master password to access CNA accounts (not the CNA's actual password)

---

## Implementation Steps

### Phase 1: Database Schema (Prisma)

#### 1.1 Update `prisma/schema.prisma`

Add the following models:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed with bcrypt
  role      Role     @default(CNA)
  cnaId     String?  @unique // Link to CNA record (null for admins)
  cna       CNA?     @relation(fields: [cnaId], references: [id])
  isActive  Boolean  @default(true)
  mustChangePassword Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions  ChartingSession[]
  reports   Report[] @relation("ReportCreator")
}

model ChartingSession {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  cnaId       String
  cna         CNA       @relation(fields: [cnaId], references: [id])
  residentIds String[]  // Array of resident IDs in this session
  startTime   DateTime  @default(now())
  endTime     DateTime?
  isActive    Boolean   @default(true)
  currentStep String    @default("start") // "start", "adls", "review"
  chartingData Json?    // Store in-progress charting data
  reportId    String?   @unique
  report      Report?   @relation(fields: [reportId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Role {
  ADMIN
  CNA
}
```

Update existing models:

- Add `User` relation to `CNA` model
- Add `createdById` field to `Report` model
- Add `ChartingSession` relation to `CNA` model

#### 1.2 Create Migration

```bash
npx prisma migrate dev --name add_user_auth_and_sessions
```

---

### Phase 2: Authentication Setup (NextAuth.js)

#### 2.1 Install Dependencies

```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

#### 2.2 Create Auth Configuration

**File**: `src/lib/auth.ts`

- Configure NextAuth with credentials provider
- Add custom callbacks for JWT (include role, cnaId, userId)
- Add session callback to expose user data
- Implement master password check for admin access to CNA accounts

#### 2.3 Create Auth API Route

**File**: `src/app/api/auth/[...nextauth]/route.ts`

- Export NextAuth handlers (GET, POST)
- Use configuration from `src/lib/auth.ts`

#### 2.4 Create Auth Helper Functions

**File**: `src/lib/auth-helpers.ts`

- `getCurrentUser()` - Get current user from session
- `requireAuth()` - Middleware helper to require authentication
- `requireRole(role)` - Middleware helper to require specific role
- `hashPassword(password)` - Hash passwords with bcrypt
- `verifyPassword(password, hash)` - Verify password against hash
- `generateTemporaryPassword()` - Generate secure temporary password

---

### Phase 3: Session Management

#### 3.1 Create Session Service

**File**: `src/lib/session-service.ts`
Functions:

- `getActiveSession(userId)` - Get user's active session if exists
- `createSession(userId, cnaId, residentIds)` - Create new session
- `updateSessionStep(sessionId, step)` - Update current step (start/adls/review)
- `updateSessionData(sessionId, data)` - Save in-progress charting data
- `endSession(sessionId)` - Mark session complete, generate report
- `canStartNewSession(userId)` - Check if user can start new session
- `resumeSession(userId)` - Get session to resume

#### 3.2 Create Session API Routes

**File**: `src/app/api/sessions/route.ts`

- `GET` - Get current user's active session
- `POST` - Create new session
- `PATCH` - Update session (step, data)
- `DELETE` - End session

**File**: `src/app/api/sessions/[id]/route.ts`

- `GET` - Get specific session
- `PATCH` - Update specific session
- `DELETE` - End specific session

---

### Phase 4: Admin CNA Account Management

#### 4.1 Create CNA Account API Routes

**File**: `src/app/api/admin/cna-accounts/route.ts`

- `GET` - List all CNA accounts with status
- `POST` - Create new CNA account (email, temporary password, link to CNA)

**File**: `src/app/api/admin/cna-accounts/[id]/route.ts`

- `GET` - Get specific CNA account
- `PATCH` - Update account (reset password, activate/deactivate)
- `DELETE` - Delete account (soft delete)

#### 4.2 Create Admin UI for CNA Accounts

**File**: `src/app/admin/cna-accounts/page.tsx`

- List all CNA accounts in table
- Show: Name, Email, Status (Active/Inactive), Last Login, Has Active Session
- Actions: Reset Password, Deactivate/Activate, Login As (master password)
- Button to create new CNA account

**File**: `src/app/admin/cna-accounts/new/page.tsx`

- Form to create new CNA account
- Fields: Select CNA from dropdown, Email
- Generate temporary password automatically
- Show temporary password to admin (one-time display)

#### 4.3 Create Active Sessions Dashboard

**File**: `src/app/admin/sessions/page.tsx`

- Show all currently active sessions
- Display: CNA Name, Start Time, Current Step, Residents Count
- Action: "Login As CNA" button (using master password)

---

### Phase 5: Update Middleware & Route Protection

#### 5.1 Update Middleware

**File**: `src/middleware.ts`

- Check authentication on all routes except `/login` and `/api/auth/*`
- Role-based protection:
  - `/admin/*` → ADMIN only
  - `/charting/*` → CNA or ADMIN
  - `/api/admin/*` → ADMIN only
- Redirect unauthenticated users to `/login`
- Redirect authenticated users from `/login` to their home page

#### 5.2 Create Route Guards

**File**: `src/lib/route-guards.ts`

- `withAuth(handler)` - HOC for API routes requiring auth
- `withRole(handler, role)` - HOC for API routes requiring specific role
- `withCNASession(handler)` - HOC for routes requiring active CNA session

---

### Phase 6: Login & Authentication UI

#### 6.1 Create Login Page

**File**: `src/app/login/page.tsx`

- Simple email/password form
- "Login" button
- Error message display
- On success:
  - ADMIN → redirect to `/admin`
  - CNA → check for active session, redirect accordingly

#### 6.2 Create Password Change Page

**File**: `src/app/profile/change-password/page.tsx`

- Form: Current Password, New Password, Confirm Password
- Force password change on first login (if `mustChangePassword` is true)

#### 6.3 Update Layout/Navigation

**File**: `src/components/layout/Navigation.tsx` (or similar)

- Show different nav items based on role:
  - ADMIN: All nav items
  - CNA: Only Charting, Review, Profile
- Add user info display (name, role)
- Add logout button

---

### Phase 7: Update Charting Flow

#### 7.1 Update Start Page

**File**: `src/app/charting/start/page.tsx`
Changes:

- REMOVE CNA selection dropdown
- Get CNA from current user session
- Check if user has active session:
  - If yes → redirect to appropriate step (adls or review)
  - If no → show resident selection
- On "Start Session":
  - Call API to create session
  - Redirect to `/charting/adls`

#### 7.2 Update ADLs Page

**File**: `src/app/charting/adls/page.tsx`
Changes:

- Check for active session on load
- If no active session → redirect to `/charting/start`
- Auto-save charting data to session periodically
- Get CNA info from session, not from selection

#### 7.3 Update Review Page

**File**: `src/app/charting/review/page.tsx`
Changes:

- Check for active session on load
- If no active session → redirect to `/charting/start`
- Load data from active session
- Add "End Session" button:
  - Calls API to end session
  - Generates report
  - Logs user out
  - Redirects to login page

#### 7.4 Create Session Context/Hook

**File**: `src/hooks/useChartingSession.ts`

- `useChartingSession()` hook
- Provides: `session`, `isLoading`, `updateSession()`, `endSession()`
- Handles session state management across charting pages

---

### Phase 8: Update Report Generation

#### 8.1 Update Report Creation

**File**: `src/app/api/reports/route.ts`
Changes:

- When creating report from session end:
  - Set `createdById` to current user ID
  - Link report to session
  - Mark session as inactive
  - Set session `endTime`

#### 8.2 Update Report Display

**File**: `src/app/admin/reports/page.tsx`
Changes:

- Add "Created By" column showing CNA name
- Add filter by CNA
- Show session duration

---

### Phase 9: Environment & Configuration

#### 9.1 Update `.env`

Add:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-random-secret>
MASTER_PASSWORD=<secure-master-password>
```

#### 9.2 Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Set a strong MASTER_PASSWORD
```

---

### Phase 10: Testing & Validation

#### 10.1 Create Seed Script for Test Users

**File**: `prisma/seed-users.js`

- Create admin user
- Create test CNA users linked to existing CNAs
- Hash passwords properly

#### 10.2 Test Scenarios

1. Admin creates CNA account
2. CNA logs in with temporary password
3. CNA changes password
4. CNA starts session
5. CNA logs out mid-session
6. CNA logs back in → resumes session
7. CNA completes session and ends it
8. CNA tries to start new session while one is active → blocked
9. Admin views active sessions
10. Admin logs in as CNA using master password
11. Admin ends session on behalf of CNA
12. Admin resets CNA password

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with 12+ rounds
2. **Session Tokens**: HTTP-only cookies via NextAuth
3. **CSRF Protection**: Handled by NextAuth
4. **Master Password**: Store securely in environment variables, never expose to client
5. **Rate Limiting**: Add to login endpoint (consider `express-rate-limit` or similar)
6. **Audit Logging**: Log all admin actions (account creation, password resets, master password usage)
7. **Session Timeout**: Consider adding auto-logout after X minutes of inactivity

---

## Database Indexes (Performance)

Add indexes to:

- `User.email` (unique already indexed)
- `ChartingSession.userId` + `isActive` (composite)
- `ChartingSession.cnaId` + `isActive` (composite)
- `Report.createdById`

---

## Future Enhancements (Not in Initial Implementation)

- Email notifications when accounts are created
- Password complexity requirements
- Two-factor authentication
- Session activity logs
- CNA performance metrics
- Bulk CNA account creation (CSV import)
- Account expiration dates

---

## Files to Create/Modify Summary

### New Files (23)

1. `src/lib/auth.ts`
2. `src/lib/auth-helpers.ts`
3. `src/lib/session-service.ts`
4. `src/lib/route-guards.ts`
5. `src/app/api/auth/[...nextauth]/route.ts`
6. `src/app/api/sessions/route.ts`
7. `src/app/api/sessions/[id]/route.ts`
8. `src/app/api/admin/cna-accounts/route.ts`
9. `src/app/api/admin/cna-accounts/[id]/route.ts`
10. `src/app/login/page.tsx`
11. `src/app/profile/change-password/page.tsx`
12. `src/app/admin/cna-accounts/page.tsx`
13. `src/app/admin/cna-accounts/new/page.tsx`
14. `src/app/admin/sessions/page.tsx`
15. `src/hooks/useChartingSession.ts`
16. `src/types/auth.ts`
17. `src/types/session.ts`
18. `prisma/seed-users.js`
19. `CNA_ACCOUNT_IMPLEMENTATION.md` (this file)

### Modified Files (7)

1. `prisma/schema.prisma`
2. `src/middleware.ts`
3. `src/app/charting/start/page.tsx`
4. `src/app/charting/adls/page.tsx`
5. `src/app/charting/review/page.tsx`
6. `src/app/api/reports/route.ts`
7. `.env`

---

## Implementation Order

Follow phases 1-10 in order. Each phase builds on the previous one.

**Estimated Time**: 2-3 days for full implementation and testing

**Critical Path**: Phase 1 (Database) → Phase 2 (Auth) → Phase 3 (Sessions) → Phase 7 (Charting Updates)

---

## Questions Resolved

✅ CNA route access: Only /charting/start, /charting/adls, /charting/review
✅ CNA report visibility: None - they only see their current charting work
✅ Session persistence: Resume on login if not ended
✅ Session enforcement: One active session per CNA, must be ended manually
✅ Password management: CNAs can change their own, admins use master password for access
✅ Session end trigger: Manual "End Session" button on review page generates report
✅ Multiple CNAs: Can have simultaneous active sessions (different CNAs)
✅ CNA selection: Removed from UI, determined by logged-in account

---

Ready to implement! 🚀
