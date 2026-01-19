# Vercel Environment Variables Setup

## Required Environment Variables for Production

You need to add these environment variables in your Vercel project settings:

### 1. Database Variables (CRITICAL FIX)
```
# Use Prisma Accelerate for connection pooling (fixes "Server has closed the connection" errors)
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19OaE9EQ3poM0d0c3I1Mi1rSHpIczgiLCJhcGlfa2V5IjoiMDFLMTIzRUdOQzZIM0hRWkJSTUFaTVlZOVoiLCJ0ZW5hbnRfaWQiOiJkYzc0ZmZmMTBjMTc1YmZmMDdmM2U3ZDM5MGY0ZWVmM2E5ZjhmMDRkNjE3MDQzYWMxYjVhYTMwNDFjMzQ1OTc4IiwiaW50ZXJuYWxfc2VjcmV0IjoiODE1NDc5ZDMtNDYwMS00YjI4LThhZjUtMjlmY2FkMjE5YTczIn0.wZORpk7jjc1cMKxyeV5NwGa0Xy1gPJmnVcgdcYcoy4M

# Direct connection (backup - not used)
POSTGRES_DIRECT_URL=postgres://dc74fff10c175bff07f3e7d390f4eef3a9f8f04d617043ac1b5aa3041c345978:sk_NhODCzh3Gtsr52-kHzHs8@db.prisma.io:5432/?sslmode=require
```

**IMPORTANT:** The DATABASE_URL must use the Prisma Accelerate connection string (starting with `prisma+postgres://`) to prevent "Server has closed the connection" errors. The direct PostgreSQL connection causes connection pool exhaustion in serverless environments.

### 2. NextAuth Configuration (CRITICAL)
```
NEXTAUTH_URL=https://smartchartpro-mvp.vercel.app

NEXTAUTH_SECRET=<GENERATE_A_NEW_SECRET>
```

**To generate NEXTAUTH_SECRET:**
Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use this Node.js command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Master Password (Managed in Database)
The master password is now managed through the Admin Settings page in the application. You no longer need to set it as an environment variable.

**To set the master password:**
1. Go to Admin Settings in your deployed application
2. Set the master password in the "Admin Security" section
3. This password will be used for CNA account access

**Legacy Environment Variable (Optional):**
```
NEXT_PUBLIC_MASTER_PASSWORD=AdminMaster2026!
```
*Note: This environment variable is no longer used for authentication. The master password is now stored securely in the database and managed through the Admin Settings UI.*

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `smartchartpro-mvp`
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Key: Variable name (e.g., `NEXTAUTH_SECRET`)
   - Value: The actual value
   - Environment: Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Quick Fix Commands

If you want to update your local .env file with a proper secret:

```bash
# Generate a new secret
openssl rand -base64 32

# Or with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then update your `.env` file with the generated secret.

## After Adding Variables

1. Go to your Vercel project
2. Click on **Deployments**
3. Find the latest deployment
4. Click the three dots (•••) → **Redeploy**
5. Make sure "Use existing Build Cache" is **unchecked**
6. Click **Redeploy**

## Testing

After redeployment, try logging in again at:
https://smartchartpro-mvp.vercel.app/login

The 500 errors should be resolved once NEXTAUTH_SECRET and NEXTAUTH_URL are properly configured.
