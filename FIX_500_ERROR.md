# Fix 500 Error - Restart Dev Server

## The Problem

The database table `ChartingReport` exists, but your running Next.js dev server is using an old Prisma client that doesn't know about it yet.

## The Solution

**Restart your development server:**

1. **Stop the dev server** (Ctrl+C in the terminal running `npm run dev`)
2. **Start it again**: `npm run dev`

That's it! The server will pick up the new Prisma schema on startup.

## Why This Happens

- Prisma generates a client based on your schema
- The client is loaded when the server starts
- Changes to the schema require a server restart
- The file lock error prevented automatic regeneration

## Verify It Works

After restarting:

1. Go to charting workflow
2. Chart some activities
3. Click "End Charting"
4. Should see success message
5. Go to Admin → Reports
6. Your report should be there!

## If Still Getting 500 Error

Check the server console logs - they now have detailed error messages that will show exactly what's wrong.

The logs will show:
- What data was received
- What fields are missing (if any)
- The exact Prisma error

## Alternative: Force Prisma Regeneration

If restarting doesn't work:

1. Stop dev server
2. Delete `node_modules/.prisma` folder
3. Run `npx prisma generate`
4. Start dev server again

---

**TL;DR: Just restart your dev server!** 🔄
